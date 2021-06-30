import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneHorizontalRule,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
//import { escape } from '@microsoft/sp-lodash-subset';

//import styles from './PlmSurveyWebPart.module.scss';
import * as strings from 'PlmSurveyWebPartStrings';

import * as $ from 'jquery';
import '@progress/kendo-ui';
import '@progress/kendo-ui/css/web/kendo.common-material.min.css';
import '@progress/kendo-ui/css/web/kendo.material.min.css';
import '@progress/kendo-ui/css/web/kendo.material.mobile.min.css';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as pnp from '@pnp/sp/presets/all';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import { PropertyFieldTextWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldTextWithCallout';
import { SPA } from './app/spa';
import * as React from 'react';

export interface IPlmSurveyWebPartProps {
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

export default class PlmSurveyWebPart extends BaseClientSideWebPart<IPlmSurveyWebPartProps> {
  protected onInit(): Promise < void > {
    return super.onInit().then(_ => {
      pnp.sp.setup({
        spfxContext: this.context,
        sp: {
          headers: {
            Accept: 'application/json;odata=nometadata'
          }
        }
      });
    });
  }

  public render(): void {
    /*
    Load external CDN files (JS/CSS)
    */
    //SPComponentLoader.loadCss('https://kendo.cdn.telerik.com/2021.2.511/styles/kendo.common-material.min.css');
    //SPComponentLoader.loadCss('https://kendo.cdn.telerik.com/2021.2.511/styles/kendo.material.min.css');
    //SPComponentLoader.loadCss('https://kendo.cdn.telerik.com/2021.2.511/styles/kendo.material.mobile.min.css');

    //SPComponentLoader.loadScript('https://kendo.cdn.telerik.com/2021.2.511/js/jszip.min.js');
    //SPComponentLoader.loadScript('https://kendo.cdn.telerik.com/2021.1.224/js/kendo.all.min.js');

    this.domElement.innerHTML = `
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 1em;
          }

          .k-form-field {
              background-color: #dedede;
              padding: 10px;
          }

          .k-form-label {
              font-weight: bold;
          }

          .k-form-fieldset {
            margin: 20px 0px 0px 0px;
            padding: 20px;
          }

          .k-form-buttons {
            margin: 0px;
            padding: 0px 20px 20px 90%;
          }
      </style>
      <h3 id="message"></h3>
      <form id="main" style="margin: 0 auto; border: 1px solid #dedede;"></form>
      <br />
      <form id="wizard" style="width: 90%; margin: 0 auto; border: 1px solid #dedede" novalidate></form>
    `;

    $('#wizard').hide();

    const app = SPA.getInstance({
      productLines: this.properties.productLines,
      productTeams: this.properties.productTeams,
      sessionsList: this.properties.sessionsList,
      campaignsList: this.properties.campaignsList,
      pillarsList: this.properties.pillarsList,
      questionsList: this.properties.questionsList,
      answersList: this.properties.answersList,
      responseList: this.properties.responseList,
      thankYouPage: this.properties.thankYouPage
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // Does not reload on property changes, customer must apply changes
  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Provide the necessary values below to drive this web part'
          },
          groups: [
            {
              groupFields: [
                PropertyFieldListPicker('productLines', {
                  label: 'Select the Product Lines list',
                  selectedList: this.properties.productLines,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('productTeams', {
                  label: 'Select the Product Teams list',
                  selectedList: this.properties.productTeams,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('sessionsList', {
                  label: 'Select the Sessions list',
                  selectedList: this.properties.sessionsList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('campaignsList', {
                  label: 'Select the Campaigns list',
                  selectedList: this.properties.campaignsList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('pillarsList', {
                  label: 'Select the Pillars list',
                  selectedList: this.properties.pillarsList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('questionsList', {
                  label: 'Select the Survey Questions list',
                  selectedList: this.properties.questionsList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('answersList', {
                  label: 'Select the Survey Answers list',
                  selectedList: this.properties.answersList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('responseList', {
                  label: 'Select the Survey Responses list',
                  selectedList: this.properties.responseList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyPaneHorizontalRule(),
                PropertyFieldTextWithCallout('thankYouPage', {
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'thankYouPage',
                  label: 'Paste link to the Thank You web page',
                  calloutContent: React.createElement('span', {}, 'If you have not created a thank you web page, please open another tab on your browser and create the web page in SharePoint. Make sure to copy the URL from the address bar and paste it into this textbox before saving your changes.'),
                  calloutWidth: 300,
                  value: this.properties.thankYouPage
                })
                /*PropertyPaneTextField('thankYouPage', {
                  label: 'Paste the Thank You web page URL'
                })*/
              ]
            }
          ]
        }
      ]
    };
  }
}
