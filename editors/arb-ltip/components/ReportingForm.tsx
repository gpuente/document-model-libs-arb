import { useCallback, useMemo, useState } from 'react';
import {
    GranteeActuals,
    Phase,
} from '../../../document-models/arb-ltip-grantee';
import { IProps } from '../editor';
import validators from '../../../document-models/arb-ltip-grantee/src/validators';
import { classNames, toArray } from '../util';
import ContractSelector from './ContractSelector';
import { editPhase } from '../../../document-models/arb-ltip-grantee/gen/creators';

type ReportingFormProps = Pick<IProps, 'editorContext' | 'dispatch'> & {
    phase: Phase;
    phaseIndex: number;
};
const ReportingForm = (props: ReportingFormProps) => {
    const { dispatch, phase, phaseIndex } = props;
    const actuals = phase.actuals!;

    const [showErrors, setShowErrors] = useState(true);
    const [arbReceivedLocal, setArbReceivedLocal] = useState(
        actuals.arbReceived ?? 0,
    );
    const [arbUtilizedLocal, setArbUtilizedLocal] = useState(
        actuals.arbUtilized ?? 0,
    );
    const [contractsLocal, setContractsLocal] = useState(
        toArray(actuals.contractsIncentivized),
    );
    const [disclosuresLocal, setDisclosuresLocal] = useState(
        actuals.disclosures ?? '',
    );
    const [summaryLocal, setSummaryLocal] = useState(actuals.summary ?? '');

    const isArbReceivedValid = useMemo(
        () => validators.isArbReceivedValid(arbReceivedLocal),
        [arbReceivedLocal],
    );
    const isArbUtilizedValid = useMemo(
        () => validators.isArbUtilizedValid(arbUtilizedLocal),
        [arbUtilizedLocal],
    );
    const isContractsValid = useMemo(
        () => validators.isContractsValid(contractsLocal),
        [contractsLocal],
    );
    const isDisclosuresValid = useMemo(
        () => validators.isDisclosuresValid(disclosuresLocal),
        [disclosuresLocal],
    );
    const isSummaryValid = useMemo(
        () => validators.isSummaryValid(summaryLocal),
        [summaryLocal],
    );

    // TODO: calculate
    const arbRemaining = useMemo(() => {
        return arbReceivedLocal;
    }, [arbReceivedLocal]);
    const dueDate = useMemo(() => {
        const date = new Date(phase.endDate);

        // nice date string
        return date.toLocaleDateString();
    }, [phase.endDate]);

    const submit = useCallback(() => {
        const actuals = {
            arbReceived: arbReceivedLocal,
            arbUtilized: arbUtilizedLocal,
            arbRemaining: arbRemaining,
            contractsIncentivized: contractsLocal,
            disclosures: disclosuresLocal,
            summary: summaryLocal,
        };

        //const isAfterCompletionDate = Date.now() >= new Date(phase.endDate).getTime();

        dispatch(
            editPhase({
                phaseIndex,
                actuals,
                status: validators.isActualsValid(actuals)
                    ? 'Finalized'
                    : 'InProgress',

                // todo: make these optional
                startDate: phase.startDate,
                endDate: phase.endDate,
            }),
        );
    }, [
        dispatch,
        arbReceivedLocal,
        arbUtilizedLocal,
        arbRemaining,
        contractsLocal,
        disclosuresLocal,
        summaryLocal,
    ]);

    const wrapperClasses = useCallback(
        (isValid: boolean) =>
            classNames(
                showErrors && !isValid
                    ? 'ring-2 ring-red-300'
                    : 'ring-1 ring-gray-300',
                'relative rounded-md rounded-b-none rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
            ),
        [showErrors],
    );

    return (
        <div className="w-full">
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <div className="text-lg px-4 pt-4 pb-8">
                    While the two-week phase is ongoing, please track the
                    project actuals here. This information should be submitted
                    by <span className="font-bold">{dueDate}</span>.
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600 flex">
                    <div
                        className={classNames(
                            showErrors && !isArbReceivedValid
                                ? 'ring-2 ring-red-300'
                                : '',
                            'flex-1 relative rounded-md rounded-b-none rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
                        )}
                    >
                        <label className="block text-xs font-medium text-gray-900">
                            ARB Received (required)
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter amount"
                            value={arbReceivedLocal}
                            onChange={e => {
                                let val;
                                try {
                                    val = parseInt(e.target.value);
                                } catch {
                                    return;
                                }

                                if (isNaN(val)) {
                                    return;
                                }

                                setArbReceivedLocal(val);
                            }}
                        />
                    </div>
                    <div
                        className={classNames(
                            showErrors && !isArbUtilizedValid
                                ? 'ring-2 ring-red-300'
                                : '',
                            'flex-1 relative rounded-md rounded-b-none rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
                        )}
                    >
                        <label className="block text-xs font-medium text-gray-900">
                            ARB Utilized (required)
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter amount"
                            value={arbUtilizedLocal}
                            onChange={e => {
                                let val;
                                try {
                                    val = parseInt(e.target.value);
                                } catch {
                                    return;
                                }

                                if (isNaN(val)) {
                                    return;
                                }

                                setArbUtilizedLocal(val);
                            }}
                        />
                    </div>
                    <div className="flex-1 relative rounded-md rounded-b-none rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                        <label className="block text-xs font-medium text-gray-900">
                            ARB Remaining
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            value={arbReceivedLocal}
                            readOnly
                        />
                    </div>
                </div>
                <div className={wrapperClasses(isContractsValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Contracts Incentivized (required)
                    </label>
                    <ContractSelector
                        contracts={contractsLocal}
                        onAdd={contract =>
                            setContractsLocal([...contractsLocal, contract])
                        }
                        onRemove={id =>
                            setContractsLocal(
                                contractsLocal.filter(c => c.contractId !== id),
                            )
                        }
                    />
                </div>
                <div className={wrapperClasses(isDisclosuresValid)}>
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Disclosures (required)
                    </label>
                    <textarea
                        rows={4}
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter disclosures here"
                        value={disclosuresLocal}
                        onChange={e => setDisclosuresLocal(e.target.value)}
                    />
                </div>
                <div className={wrapperClasses(isSummaryValid)}>
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Summary (required)
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter summary here"
                        value={summaryLocal}
                        onChange={e => setSummaryLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={submit}
            >
                Update
            </button>
        </div>
    );
};

export default ReportingForm;