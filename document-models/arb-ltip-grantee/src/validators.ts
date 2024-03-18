import { GranteeActuals, GranteePlanned, Maybe } from '..';

const gtZero = (value: Maybe<number>) => !!value && value > 0;
const gteZero = (value: Maybe<number>) => !!value && value > 0;
const notEmpty = (value: Maybe<string>) => !!value && value.length > 0;
const pastDate = (value: Date) => value.getTime() < Date.now();
const futureDate = (value: Date) => value.getTime() > Date.now();
function isNotEmpty<T>(value: Maybe<Array<Maybe<T>>>) {
    return !!value && value.filter(v => !!v).length > 0;
}

const isDisbursementValid = gtZero;
const isDistributionMechanismsValid = isNotEmpty;
const isContractsValid = isNotEmpty;
const isSummaryValid = notEmpty;
const isSummaryOfChangesValid = notEmpty;
const isStartDateValid = futureDate;
const isEndDateValid = futureDate;

const isArbReceivedValid = gtZero;
const isArbRemainingValid = gtZero;
const isArbUtilizedValid = gtZero;
const isDisclosuresValid = notEmpty;

const isPlannedValid = (planned: GranteePlanned) =>
    isDisbursementValid(planned.arbToBeDistributed) &&
    isDistributionMechanismsValid(planned.distributionMechanism) &&
    isContractsValid(planned.contractsIncentivized) &&
    isSummaryValid(planned.summary) &&
    isSummaryOfChangesValid(planned.summaryOfChanges);

const isActualsValid = (actuals: GranteeActuals) =>
    gteZero(actuals.arbReceived) &&
    gteZero(actuals.arbRemaining) &&
    gteZero(actuals.arbUtilized) &&
    isContractsValid(actuals.contractsIncentivized) &&
    isDisclosuresValid(actuals.disclosures) &&
    isSummaryValid(actuals.summary);

const validators = {
    isDisbursementValid,
    isDistributionMechanismsValid,
    isContractsValid,
    isSummaryValid,
    isSummaryOfChangesValid,
    isStartDateValid,
    isEndDateValid,

    isArbReceivedValid,
    isArbRemainingValid,
    isArbUtilizedValid,
    isDisclosuresValid,

    isPlannedValid,
    isActualsValid,
};
export default validators;