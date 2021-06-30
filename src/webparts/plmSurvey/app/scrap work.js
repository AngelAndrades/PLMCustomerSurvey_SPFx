ClearCollect(col1,{t: "t1"}, {t: "t2"}, {t: "t3"}); ClearCollect(col2, {t: "t3"});
ForAll(col2, Remove(col1, ThisRecord))


cq = [{"QuestionId":1,"Points":21},{"QuestionId":3,"Points":6},{"QuestionId":4,"Points":5}];
q = [{"Pillar":{"Title":"Demographics","OrderBy":1},"Id":10,"ID":10,"Title":"How many product owners (business sponsors) regularly participate in any kind of product team meeting?","QuestionType":"Single Select"},{"Pillar":{"Title":"Demographics","OrderBy":1},"Id":1,"ID":1,"Title":"Total Project Team Size (both Feds and Contractors)","QuestionType":"Single Select"},{"Pillar":{"Title":"Demographics","OrderBy":1},"Id":11,"ID":11,"Title":"My user community consists of:","QuestionType":"Single Select"},{"Pillar":{"Title":"Culture","OrderBy":2},"Id":2,"ID":2,"Title":"My product development team (all of the people involved in actual product creation and delivery):","QuestionType":"Single Select"},{"Pillar":{"Title":"Culture","OrderBy":2},"Id":9,"ID":9,"Title":"Do you have a document, such as a roadmap, which describes at a high level your future product development/evolution?","QuestionType":"Single Select"},{"Pillar":{"Title":"Process","OrderBy":3},"Id":12,"ID":12,"Title":"We have a standardized process for change control that includes:","QuestionType":"Single Select"},{"Pillar":{"Title":"Process","OrderBy":3},"Id":3,"ID":3,"Title":"My next planned release (to the user community) is:","QuestionType":"Single Select"},{"Pillar":{"Title":"Process","OrderBy":3},"Id":13,"ID":13,"Title":"Does your team have a recurring backlog refinement session with the team ?","QuestionType":"Single Select"},{"Pillar":{"Title":"Technology","OrderBy":4},"Id":4,"ID":4,"Title":"What percent of your overall Continuous Delivery Pipeline (CDP), including production, is provisioned  via Infrastructure as Code (IaC)?","QuestionType":"Single Select"},{"Pillar":{"Title":"Technology","OrderBy":4},"Id":15,"ID":15,"Title":"To what extent does each environment meet a full level of Production parity?","QuestionType":"Single Select"},{"Pillar":{"Title":"Technology","OrderBy":4},"Id":14,"ID":14,"Title":"What percent of your overall Continuous Delivery Pipeline (CDP), including production, is provisioned  via Infrastructure as Code (IaC)?","QuestionType":"Single Select"}];
a = [{"Title":"0 - 5","Value":5,"QuestionId":1},{"Title":"6 - 10","Value":10,"QuestionId":1},{"Title":"11 - 15","Value":15,"QuestionId":1},{"Title":"16 - 20","Value":20,"QuestionId":1},{"Title":"21 and over","Value":21,"QuestionId":1},{"Title":"Don't know","Value":0,"QuestionId":1},{"Title":"Always includes representatives and participation from security, users, infrastructure","Value":6,"QuestionId":2},{"Title":"Always includes representatives and participation from security, users, infrastructure","Value":6,"QuestionId":2},{"Title":"Rarely includes representatives and participation from security, users, infrastructure","Value":2,"QuestionId":2},{"Title":"Never includes representatives and participation from security, users, infrastructure","Value":0,"QuestionId":2},{"Title":"I don't understand the question","Value":0,"QuestionId":2},{"Title":"Don't know","Value":0,"QuestionId":2},{"Title":"1 - 3 months","Value":6,"QuestionId":3},{"Title":"4 - 6 months","Value":5,"QuestionId":3},{"Title":"7 - 12 months","Value":3,"QuestionId":3},{"Title":"13 - 24 months","Value":1,"QuestionId":3},{"Title":"Over 25 months","Value":0,"QuestionId":3},{"Title":"Nothing delivered to date","Value":0,"QuestionId":3},{"Title":"I don't understand the question","Value":0,"QuestionId":3},{"Title":"Don't know","Value":0,"QuestionId":3},{"Title":"100% - All environments from development  to production are provisioned via IaC ","Value":5,"QuestionId":4},{"Title":"75% - Most environments from development  to production are provisioned via IaC ","Value":4,"QuestionId":4},{"Title":"50% - We provision lower (anything below production) environments but higher ones are still manually provisioned","Value":3,"QuestionId":4},{"Title":"25% - We provision some environments when possible","Value":2,"QuestionId":4},{"Title":"0% - We don't utilize IaC","Value":0,"QuestionId":4},{"Title":"I don't understand the question.","Value":0,"QuestionId":4},{"Title":"Don't know","Value":0,"QuestionId":4},{"Title":"Yes, with a formal document and/or presentation","Value":7,"QuestionId":9},{"Title":"Yes, informally over a series of team meetings","Value":5,"QuestionId":9},{"Title":"Partially, through informal conversations with various team members","Value":3,"QuestionId":9},{"Title":"No, there's been no statement regarding future direction","Value":0,"QuestionId":9},{"Title":"I don't understand the question","Value":0,"QuestionId":9},{"Title":"Don't know","Value":0,"QuestionId":9},{"Title":"0-5","Value":5,"QuestionId":10},{"Title":"6-10","Value":10,"QuestionId":10},{"Title":"11-20","Value":23,"QuestionId":10},{"Title":"Don't Know","Value":0,"QuestionId":10},{"Title":"0-50 People","Value":5,"QuestionId":11},{"Title":"51-100 People","Value":10,"QuestionId":11},{"Title":"101-250","Value":15,"QuestionId":11},{"Title":"251-500","Value":20,"QuestionId":11},{"Title":"501-1000","Value":100,"QuestionId":11},{"Title":"Over 100 People","Value":101,"QuestionId":11},{"Title":"Don't Know","Value":0,"QuestionId":11},{"Title":"Rountinely includes representatives and participation from security, users, infrastructure","Value":5,"QuestionId":2},{"Title":"Documenting and updating ALL approved changes across the system","Value":6,"QuestionId":12},{"Title":"Documenting and updating MOST approved changes across the system","Value":4,"QuestionId":12},{"Title":"Approved changes are generally not documented","Value":2,"QuestionId":12},{"Title":"I don't understand the question.","Value":0,"QuestionId":12},{"Title":"Don't know","Value":0,"QuestionId":12},{"Title":"Always","Value":6,"QuestionId":13},{"Title":"Sometimes","Value":3,"QuestionId":13},{"Title":"Never","Value":0,"QuestionId":13},{"Title":"I don't understand the question.","Value":0,"QuestionId":13},{"Title":"Don't know","Value":0,"QuestionId":13},{"Title":"100% - All environments from development  to production are provisioned via IaC ","Value":5,"QuestionId":14},{"Title":"75% - Most environments from development  to production are provisioned via IaC ","Value":4,"QuestionId":14},{"Title":"50% - We provision lower (anything below production) environments but higher ones are still manually provisioned","Value":3,"QuestionId":14},{"Title":"25% - We provision some environments when possible","Value":2,"QuestionId":14},{"Title":"0% - We don't utilize IaC","Value":0,"QuestionId":14},{"Title":"I don't understand the question.","Value":0,"QuestionId":14},{"Title":"Don't know","Value":0,"QuestionId":14},{"Title":"Fully - Dev-Prod parity is a key acceptance criteria for each release","Value":6,"QuestionId":15},{"Title":"Significant - We try to achieve Dev-Prod parity whenever feasible","Value":5,"QuestionId":15},{"Title":"Limited - Dev-Prod parity is a low priority for the product team","Value":3,"QuestionId":15},{"Title":"None - Dev-Prod parity is not a consideration and/or possible","Value":0,"QuestionId":15},{"Title":"I don't understand the question.","Value":0,"QuestionId":15},{"Title":"Don't know","Value":0,"QuestionId":15}];

cq.forEach(x => {q.forEach(y => { if(x.QuestionId == y.Id) {y['Points'] = x.Points; y['OrderBy'] = y.Pillar['OrderBy']; y.Pillar = y.Pillar.Title;} })})

a = new Set(cq.map(x => x.QuestionId));
b = new Set(q.map(x => x.Id));
c = [...q.filter(x => a.has(x.Id))];

c.forEach(x => {
    cq.forEach(y => {
        if (x.Id == y.QuestionId) {
            x['Points'] = y.Points;
            //x['Order'] = x.Pillar.OrderBy;
            //x['Pillar'] = x.Pillar.Title;
        }
    });
});






        /*
        sp.web.lists.getById(args.questionsList).items.select('Id,Title,Label,Category/Title,Category/Order').expand('Category').orderBy('Order').getPaged()
        .then(resQuestions => {
            sp.web.lists.getById(args.answersList).items.select('Title,Value,Question/Id,Question/Title,Question/Label').expand('Question').top(1000).getPaged()
            .then(resAnswers => {
                // get unique list of categories
                const categories = new Set(resQuestions.results.map(item => item.Category.Title));

                let counter = 0;
                categories.forEach(category => {
                    counter++;
                    let stepObj = new Object();
                    stepObj['title'] = category;
                    stepObj['buttons'] = (counter === 1) ? ['next'] : (counter === categories.size) ? ['previous', 'done'] : ['previous', 'next'];
                    stepObj['form'] = new Object();
                    stepObj['form']['orientation'] = 'vertical';
                    stepObj['form']['formData'] = new Object();
                    stepObj['form']['items'] = [];

                    // get related questions for the category
                    let questions = resQuestions.results.filter(item => {
                        if (item.Category.Title === category) return item;
                    });

                    questions.forEach(question => {
                        let questionObj = new Object();
                        stepObj['form']['formData'][question.Title] = null;
                        questionObj['field'] = question.Title;
                        questionObj['label'] = question.Label;
                        questionObj['validation'] = { required: { message: 'test' } };
                        questionObj['editor'] = 'RadioGroup';
                        questionObj['editorOptions'] = new Object();
                        questionObj['editorOptions']['items'] = [];
                        questionObj['editorOptions']['layout'] = 'vertical';
                        questionObj['editorOptions']['labelPosition'] = 'after';
                        stepObj['form']['items'].push(questionObj);

                        // get related answers to the question
                        let answers = resAnswers.results.filter(item => {
                            if (item.Question.Title === question.Title) return item;
                        });
                        
                        answers.forEach(answer => {
                            questionObj['editorOptions']['items'].push({value: answer.Value, label: answer.Title});
                        });
                    });

                    stepOptions.push(stepObj);
                });

                this.wizardOptions = {
                    actionBar: true,
                    contentPosition: 'bottom',
                    pager: true,
                    stepper: { indicator: true, label: true, linear: true },
                    steps: stepOptions,

                    // events
                    done: e => {
                        e.originalEvent.preventDefault();

                        // merge form data into a single object
                        let formData = new Object();
                        for (const form of e.forms) {
                            formData = {...formData, ...form._model};
                        }
                        

                        // remove unwanted object properties
                        const cleanseData = Object.keys(formData).reduce((object, key) => {
                            if (key.toUpperCase().indexOf('Q') === 0) object[key] = formData[key];
                            return object;
                        }, {});
                        console.log(formData, cleanseData);

                        for (let _key in cleanseData) {
                            let _answer = undefined;
                            if (cleanseData.hasOwnProperty(_key)) _answer = cleanseData[_key];
                            console.log(_key, _answer);

                            sp.web.lists.getById(args.responseList).items.add({Title: _key, Answer: _answer})
                            .then(response => {
                                console.log(response);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                        }

                        kendo.alert('Redirect user to thank you page.');
                    }
                };
                this.wizard = $("#wizard").kendoWizard(this.wizardOptions).data('kendoWizard');
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });
        */

