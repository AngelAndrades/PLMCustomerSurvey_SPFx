import { registerCustomRequestClientFactory, sp } from '@pnp/sp/presets/all';
//import { CurrentUser } from '@pnp/sp/site-users'
import * as $ from 'jquery';
import * as JSZip from 'jszip';
import '@progress/kendo-ui';

export interface Params {
    productLines: string;
    productTeams: string;
    sessionsList: string;
    campaignsList: string;
    pillarsList: string;
    questionsList: string;
    answersList: string;
    responseList: string;
    thankYouPage: string;
}

export class SPA {
    protected static wizard: kendo.ui.Wizard;
    protected static wizardOptions: kendo.ui.WizardOptions;
    protected static form: kendo.ui.Form;
    protected static formOptions: kendo.ui.FormOptions;
    protected static dialog: kendo.ui.Dialog;
    protected static dialogOptions: kendo.ui.DialogOptions;
    private static instance: SPA;

    constructor() {}

    public static getInstance(args: Params): SPA {
        type sessionState = 'New' | 'In Progress' | 'Completed';
        const stepOptions = [];
        let qa = null;
        let campaignId: string = null;
        let sessionId: string = null;
        let session: sessionState = 'New';
        let productLine: string = null;
        let productTeam: string = null;
        let vasiId: string = null;

        let ddProductLine = null;
        let ddProductTeam = null;

        window['JSZip'] = JSZip;

        const render = () => {
            // Get the active campaign, there should only be 1 active campaign at a time
            sp.web.lists.getById(args.campaignsList).items.select('Id, UniqueID0, SurveyMessage').filter('Active eq ' + 1).top(1).get()
            .then(async resCampaign => {
                // @ts-ignore: JQuery element not found
                $('#message')[0].innerHTML = resCampaign[0]['SurveyMessage'];

                // Get the current SharePoint User info
                const userInfo: number = await sp.web.currentUser.get().then(async user => await user.Id).catch(err => { throw(err); });

                // Get Product Lines/Teams list data
                sp.web.lists.getById(args.productLines).items.select('Id,Title').getAll()
                .then(resProductLines => {
                    ddProductLine = resProductLines;
                    sp.web.lists.getById(args.productTeams).items.select('Id,Title,Product_x0020_LineId').getAll()
                    .then(resProductTeams => {
                        ddProductTeam = resProductTeams.map(t => {
                            t.Id = t.Product_x0020_LineId;
                            return t;
                        });
                    })
                    .catch(err => { throw(err); });
                })
                .catch(err => { throw(err); });

                // Check if there is a previous sessions
                let savedSession = await sp.web.lists.getById(args.sessionsList).items.select('Id, Title, CampaignID, ProductLine, ProductTeam, VASIID').filter('Editor eq ' + userInfo + ' and Status eq \'In Progress\' and CampaignID eq \'' + resCampaign[0]['UniqueID0'] + '\'').top(1).get()
                .then(async resSession => await resSession[0])
                .catch(err => { throw(err); });

                // Set the Session ID
                if (savedSession === undefined) {
                    campaignId = resCampaign[0].UniqueID0;
                    sessionId = kendo.guid();
                } else {
                    session = 'In Progress';
                    campaignId = savedSession['CampaignID'];
                    sessionId = savedSession['Title'];
                    productLine = savedSession['ProductLine'];
                    productTeam = savedSession['ProductTeam'];
                    vasiId = savedSession['VASIID'];

                    // If the campaign is not active, do not allow the user to complete the survey
                    if(savedSession['CampaignID'] !== resCampaign[0].UniqueID0) kendo.alert('The survey is no longer active...');

                    // Set the session to "Incomplete" or ask customer
                }

                sp.web.lists.getById(args.questionsList).items.select('QuestionId, Points').filter('Title eq ' + resCampaign[0]['Id']).get()
                .then(resCampaignQuestions => {
                    sp.web.lists.getByTitle('Questions').items.select('Id, Title, Pillar/Title, Pillar/OrderBy, QuestionType').expand('Pillar').orderBy('Pillar/OrderBy').get()
                    .then(resQuestions => {
                        sp.web.lists.getById(args.answersList).items.select('Title, Value, QuestionId').top(5000).get()
                        .then(resAnswers => {
                            // Store answers arrays for lookups when saving survey responses
                            qa = [...resAnswers];

                            const cqId = new Set(resCampaignQuestions.map(x => x.QuestionId));
                            const campaignQuestions = [...resQuestions.filter(x => cqId.has(x.Id))];
                            campaignQuestions.map(x => resCampaignQuestions.map(y => {
                                if (y.QuestionId == x.Id) {
                                    x['Points'] = y.Points;
                                }
                            }));
                            campaignQuestions.forEach(x => {
                                x['OrderBy'] = x.Pillar.OrderBy;
                                x.Pillar = x.Pillar.Title;
                            });

                            const surveyCategories = new Set(campaignQuestions.map(item => item.Pillar));
                            Array.from(surveyCategories).forEach((sc, index) => {
                                let stepObj = new Object();
                                stepObj['title'] = sc;
                                stepObj['buttons'] = (index === 0) ? ['next'] : (index === (surveyCategories.size - 1)) ? ['previous', {name: 'done', text: 'SUBMIT'}] : ['previous', 'next'];
                                stepObj['form'] = new Object();
                                stepObj['form']['orientation'] = 'vertical';
                                stepObj['form']['formData'] = new Object();
                                stepObj['form']['items'] = [];

                                // get related questions for the category
                                let questions = campaignQuestions.filter(item => {
                                    if (item.Pillar === sc) return item;
                                });

                                questions.sort((a,b) => a.Id > b.Id ? 1 : -1);
                                questions.forEach(question => {
                                    let questionObj = new Object();
                                    stepObj['form']['formData']['Q' + question.Id] = null;
                                    questionObj['field'] = 'Q' + question.Id;
                                    questionObj['label'] = question.Title;
                                    questionObj['validation'] = { required: true };
                                    questionObj['editor'] = 'RadioGroup';
                                    questionObj['editorOptions'] = new Object();
                                    questionObj['editorOptions']['items'] = [];
                                    questionObj['editorOptions']['layout'] = 'vertical';
                                    questionObj['editorOptions']['labelPosition'] = 'after';
                                    stepObj['form']['items'].push(questionObj);
            
                                    // get related answers to the question
                                    let answers = resAnswers.filter(item => {
                                        if (item.QuestionId === question.Id) return item;
                                    });
                                    
                                    answers.forEach(answer => {
                                        questionObj['editorOptions']['items'].push({value: answer.Value, label: answer.Title});
                                    });
                                });

                                stepOptions.push(stepObj);
                            });

                            this.formOptions = {
                                orientation: 'vertical',
                                formData: { pl: null, pt: null, vasi: null },
                                items: [{
                                    type: 'group',
                                    label: 'Product Line Management DSO Self-Assessment',
                                    items: [
                                        {field: 'pl', label: 'Product Line', validation: { required: { message: 'This is a required field.' } }, editor: 'DropDownList', editorOptions: {
                                            optionLabel: 'Select the Product Line...',
                                            dataTextField: 'Title',
                                            dataValueField: 'Id',
                                            dataSource: ddProductLine

                                        }},
                                        {field: 'pt', label: 'Product Team', validation: { required: { message: 'This is a required field.' } }, editor: 'DropDownList', editorOptions: {
                                            optionLabel: 'Select the Product Team...',
                                            dataTextField: 'Title',
                                            dataValueField: 'Id',
                                            cascadeFrom: 'pl',
                                            dataSource: ddProductTeam
                                        }},
                                        {field: 'vasi', label: 'VASI ID', validation: { required: { message: 'This is a required field.' } }}
                                    ]
                                }],
                                submit: e => {
                                    e.preventDefault();

                                    // Set environment variables
                                    productLine = e.model['pl']['Title'];
                                    productTeam = e.model['pt']['Title'];
                                    vasiId = e.model['vasi'];

                                    // Toggle visibility
                                    $('#message').hide();
                                    $('#main').hide();
                                    $('#wizard').show();
                                }
                            };
                            /*/ @ts-ignore: kendoForm not found as a JQuery element*/
                            this.form = $('#main').kendoForm(this.formOptions).data('kendoForm');
                            $('#main').find('.k-form-clear').css('display','none');
                            $('#main').find('.k-form-submit')[0].innerText = 'Next';

                            this.wizardOptions = {
                                actionBar: true,
                                contentPosition: 'bottom',
                                pager: true,
                                stepper: { indicator: true, label: true, linear: true },
                                steps: stepOptions,
            
                                // events
                                select: e=> {
                                    if (session === 'In Progress') console.log('session id: ', sessionId, 'campaign id: ', campaignId, 'session state: ', session, 'savedSession: ', savedSession);
                                    else {
                                        session = 'In Progress';
                                        sp.web.lists.getById(args.sessionsList).items.add({Title: sessionId, CampaignID: campaignId, ProductLine: productLine, ProductTeam: productTeam, VASIID: vasiId, Status: session})
                                        .then(r => {
                                            let _temp = new Object();
                                            _temp['Id'] = r.data.Id;
                                            _temp['Title'] = r.data.Title;
                                            _temp['CampaignID'] = r.data.CampaignID;
                                            _temp['ProductLine'] = r.data.ProductLine;
                                            _temp['ProductTeam'] = r.data.ProductTeam;
                                            _temp['VASIID'] = r.data.VASIID;
                                            _temp['Status'] = session;

                                            savedSession = _temp;
                                        })
                                        .catch(err => { throw(err); });
                                    }
                                },
                                done: e => {
                                    e.originalEvent.preventDefault();
                                    console.log(e);
                                    $('button[type="submit"]').slice($('button[type="submit"]').length-1).prop('disabled','disabled');
                                    kendo.alert('Your survey responses are being recorded, please wait a moment and do not close the browser window.');
            
                                    // merge form data into a single object
                                    let formData = new Object();
                                    for (const form of e.forms) {
                                        formData = {...formData, ...form._model};
                                    }
                                    console.log(formData);
            
                                    // remove unwanted object properties
                                    const cleanseData = Object.keys(formData).reduce((object, key) => {
                                        if (key.toUpperCase().indexOf('Q') === 0) object[key] = formData[key];
                                        return object;
                                    }, {});
            
                                    /*let rows = [{
                                        cells: [
                                            {value: 'Session ID'},
                                            {value: 'Campaign ID'},
                                            {value: 'Question ID'},
                                            {value: 'AnswerValue'},
                                            {value: 'AnswerLabel'}
                                        ]
                                    }];*/

                                    //let list = sp.web.lists.getById(args.responseList);
                                    //const entityTypeFullName = list.getListItemEntityTypeFullName();
                                    let batch = sp.web.createBatch();

                                    for (let _key in cleanseData) {
                                        let _answer = null;
                                        // Zero values are incorrectly convert to string "on", set them back to 0
                                        if (cleanseData.hasOwnProperty(_key)) _answer = (cleanseData[_key] === 'on' ? 0 : cleanseData[_key]);
                                        //console.log(_key, _answer);
            
                                        // Fetch the answer label, needed for response list
                                        let answerText = (qa.filter(x => x.QuestionId == _key.slice(1)).filter(x => x.Value == _answer))[0]['Title'];

                                        // Get the actual question text, not the ID
                                        /*let questionText = resQuestions.filter(x => x.Id === _key.slice(1));
                                        console.log(questionText);
                                        rows.push({
                                            cells: [
                                                {value: sessionId},
                                                {value: campaignId},
                                                {value: _key},
                                                {value: _answer},
                                                {value: answerText}
                                            ]
                                        });*/

                                        //sp.web.lists.getById(args.responseList).items.add({Title: sessionId, Campaign: campaignId, Question: _key, AnswerValue: _answer, AnswerLabel: answerText})
                                        sp.web.lists.getById(args.responseList).items.inBatch(batch).add({Title: sessionId, Campaign: campaignId, Question: _key, AnswerValue: _answer, AnswerLabel: answerText})
                                        .catch(err => { 
                                            // create a backup process to capture survey data into html file
                                            /*
                                            //console.log(rows);
                                            let workBook = new kendo.ooxml.Workbook({
                                                sheets: [{
                                                    columns: [
                                                        {autoWidth: true},
                                                        {autoWidth: true},
                                                        {autoWidth: true},
                                                        {autoWidth: true},
                                                        {autoWidth: true}
                                                    ],
                                                    title: 'Saved PLM Survey Responses',
                                                    rows: rows
                                                }],
                                            });

                                            
                                            //console.log(JSON.stringify(rows));
                                            workBook.toDataURLAsync()
                                            .then(dataUrl => {
                                                kendo.saveAs({
                                                    dataURI: dataUrl,
                                                    fileName: 'PLM Survey Responses Emergency Backup File.xlsx'
                                                });
                                            })
                                            .catch(err => {
                                                kendo.alert('SharePoint encountered an error while trying to save your survey responses.');
                                                throw(err);
                                            });
                                            */
                                            throw(err);
                                        });
                                    }

                                    batch.execute().then(_ => {
                                        // update the session list status to completed
                                        sp.web.lists.getById(args.sessionsList).items.getById(savedSession['Id']).update({Status: 'Completed'})
                                        .then(__ => {
                                            //kendo.alert('Redirect user to thank you page.');
                                            window.location.href = args.thankYouPage;
                                        })
                                        .catch(err => { throw(err); });
                                    }).catch(err => {
                                        kendo.alert('There was an error saving the survey to SharePoint.');
                                        throw(err);
                                    });

                                }
                            };
                            this.wizard = $("#wizard").kendoWizard(this.wizardOptions).data('kendoWizard');
            
                        })
                        .catch(err => { throw(err); });
                    })
                    .catch(err => { throw(err); });
                })
                .catch(err => { throw(err); });
            })
            .catch(error => {
                throw(error);
            });
        };

        /*
            Limit customer responses to 1 per customer
        */
        const getActiveSurvey = async() => await sp.web.lists.getByTitle('Campaigns').items.select('UniqueID0').filter('Active eq 1').get().then(response => response[0]['UniqueID0']).catch(err => { throw(err); });
        const getCurrentUserId = async() => await sp.web.currentUser().then(response => response['Id']).catch(err => { throw(err); });

        // self-invoking anonymous function
        (async() => {
            let activeCampaignId = await getActiveSurvey().then(res => res);
            let userId = await getCurrentUserId().then(res => res);
            console.log(activeCampaignId, userId);

            await sp.web.lists.getByTitle('Survey Session Tracker').items.filter("CampaignID eq '" + activeCampaignId + "' and AuthorId eq " + userId).get()
            .then(res => {
                if (res.length > 0) {
                    this.dialogOptions = {
                        title: 'DSO Self-Assessment Alert',
                        closable: false,
                        content: 'The DSO Self-Assessment is used to gather information on a Team\'s Maturity Level and can only be completed one time.  Contact the ACOE Agile Coaching Team if you have any questions.',
                        modal: true,
                        width: 600,
                        actions: [
                            { text: 'OK', primary: true, action: () => {
                                window.location.href = args.thankYouPage;
                            } }
                        ]
                    };
                    this.dialog = $('#message').kendoDialog(this.dialogOptions).data('kendoDialog');
                } else {
                    render();
                }
            })
            .catch(err => { console.log(err); });
        })();

        return SPA.instance;
    }
}