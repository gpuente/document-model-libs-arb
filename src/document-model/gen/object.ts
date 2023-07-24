import { BaseDocument, applyMixins } from '../../document/object';
import { DocumentModelState } from '@acaldas/document-model-graphql/document-model';
import { DocumentModelAction } from './actions';
import { createEmptyExtendedDocumentModelState } from '../custom/utils';
import type { ExtendedDocumentModelState } from "./types";
import { reducer } from './reducer';

import DocumentModel_Header from './header/object'
import DocumentModel_Module from './module/object'
import DocumentModel_OperationError from './operation-error/object'
import DocumentModel_OperationExample from './operation-example/object'
import DocumentModel_Operation from './operation/object'
import DocumentModel_State from './state/object'
;

export * from './header/object'
export * from './module/object'
export * from './operation-error/object'
export * from './operation-example/object'
export * from './operation/object'
export * from './state/object'
;

interface DocumentModel extends 
    DocumentModel_Header,
    DocumentModel_Module,
    DocumentModel_OperationError,
    DocumentModel_OperationExample,
    DocumentModel_Operation,
    DocumentModel_State {}

class DocumentModel extends BaseDocument<DocumentModelState, DocumentModelAction> {
    static fileExtension = 'phdm';

    public get state() { return this._state.data; }

    constructor(initialState?: ExtendedDocumentModelState) {
        super(reducer, initialState || createEmptyExtendedDocumentModelState());
    }

    public saveToFile(path: string, name?: string) {
        return super.saveToFile(path, DocumentModel.fileExtension, name);
    }

    public loadFromFile(path: string) {
        return super.loadFromFile(path);
    }

    static async fromFile(path: string) {
        const document = new this();
        await document.loadFromFile(path);
        return document;
    }
}

applyMixins(DocumentModel, [
    DocumentModel_Header,
    DocumentModel_Module,
    DocumentModel_OperationError,
    DocumentModel_OperationExample,
    DocumentModel_Operation,
    DocumentModel_State
]);

export { DocumentModel, ExtendedDocumentModelState };