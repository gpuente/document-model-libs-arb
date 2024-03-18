import { useCallback, useMemo, useState } from 'react';
import TagSelector from './TagSelector';
import {
    DistributionMechanism,
    GranteePlanned,
    Phase,
} from '../../../document-models/arb-ltip-grantee';
import ContractSelector from './ContractSelector';
import { IProps } from '../editor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { editPhase } from '../../../document-models/arb-ltip-grantee/gen/creators';
import { Maybe } from 'document-model/document-model';
import validators from '../../../document-models/arb-ltip-grantee/src/validators';
import { classNames, toArray } from '../util';

const distributionMechanisms = [
    {
        name: 'Airdrop',
        value: 'Airdrop',
    },
    {
        name: 'LP Incentives',
        value: 'LPIncentives',
    },
];

type PlannedResourcesFormProps = Pick<IProps, 'editorContext' | 'dispatch'> & {
    phase: Phase;
    phaseIndex: number;
};
const PlannedResourcesForm = (props: PlannedResourcesFormProps) => {
    const { dispatch, phase, phaseIndex } = props;
    const planned = phase.planned!;

    const [showErrors, setShowErrors] = useState(false);
    const [startDateLocal, setStartDateLocal] = useState(
        new Date(phase.startDate),
    );
    const [disbursementAmountLocal, setDisbursementAmountLocal] = useState(
        planned.arbToBeDistributed || 0,
    );
    const [distributionMechanismsLocal, setDistributionMechanismsLocal] =
        useState(toArray(planned.distributionMechanism));
    const [contractsLocal, setContractsLocal] = useState(
        toArray(planned.contractsIncentivized),
    );
    const [summaryLocal, setSummaryLocal] = useState(planned.summary || '');
    const [summaryOfChangesLocal, setSummaryOfChangesLocal] = useState(
        planned.summaryOfChanges || '',
    );

    const endDate = useMemo(
        () => new Date(startDateLocal.getTime() + 12096e5),
        [startDateLocal],
    );

    const isValid = useMemo(
        () => validators.isPlannedValid(planned),
        [planned],
    );

    const submit = useCallback(() => {
        const planned = {
            arbToBeDistributed: disbursementAmountLocal,
            contractsIncentivized: contractsLocal,
            distributionMechanism: distributionMechanismsLocal,
            summary: summaryLocal,
            summaryOfChanges: summaryOfChangesLocal,
        };

        if (!validators.isPlannedValid(planned)) {
            setShowErrors(true);
            return;
        }

        dispatch(
            editPhase({
                phaseIndex,
                planned,
                status: 'InProgress',
                startDate: startDateLocal.toISOString(),
                endDate: endDate.toISOString(),
            }),
        );
    }, [
        dispatch,
        phaseIndex,
        startDateLocal,
        endDate,
        disbursementAmountLocal,
        contractsLocal,
        distributionMechanismsLocal,
        summaryLocal,
        summaryOfChangesLocal,
    ]);

    const isDisbursementValid = useMemo(
        () => validators.isDisbursementValid(disbursementAmountLocal),
        [disbursementAmountLocal],
    );
    const isDistributionMechanismsValid = useMemo(
        () =>
            validators.isDistributionMechanismsValid(
                distributionMechanismsLocal,
            ),
        [distributionMechanismsLocal],
    );
    const isContractsValid = useMemo(
        () => validators.isContractsValid(contractsLocal),
        [contractsLocal],
    );
    const isSummaryValid = useMemo(
        () => validators.isSummaryValid(summaryLocal),
        [summaryLocal],
    );
    const isSummaryOfChangesValid = useMemo(
        () => validators.isSummaryOfChangesValid(summaryOfChangesLocal),
        [summaryOfChangesLocal],
    );

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
                    Before the two-week disbursement phase begins, please enter
                    the planned resources here. After the phase start date, you
                    will be able to update the project actuals.
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600 flex">
                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDateLocal}
                            onChange={date =>
                                setStartDateLocal(date || startDateLocal)
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            End Date
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={_ => {
                                /* disallow */
                            }}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className={wrapperClasses(isDisbursementValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        ARB Disbursement Amount (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter amount"
                        value={disbursementAmountLocal}
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

                            setDisbursementAmountLocal(val);
                        }}
                    />
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
                <div className={wrapperClasses(isDistributionMechanismsValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Distribution Mechanisms (required)
                    </label>
                    <TagSelector
                        value={distributionMechanismsLocal}
                        schema={distributionMechanisms}
                        onAdd={value =>
                            setDistributionMechanismsLocal([
                                ...distributionMechanismsLocal,
                                value as DistributionMechanism,
                            ])
                        }
                        onRemove={value =>
                            setDistributionMechanismsLocal(
                                distributionMechanismsLocal.filter(
                                    v => v !== value,
                                ),
                            )
                        }
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
                <div className={wrapperClasses(isSummaryOfChangesValid)}>
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Summary of Changes (required)
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter summary of changes here"
                        value={summaryOfChangesLocal}
                        onChange={e => setSummaryOfChangesLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={submit}
            >
                {isValid ? 'Update' : 'Submit'}
            </button>
        </div>
    );
};

export default PlannedResourcesForm;