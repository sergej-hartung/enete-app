
export function getGuarantee(rate: any) {
    if (Object.keys(rate).length > 0) {
      if (rate.optGuarantee == '0') {
        return 'keine Preisgarantie'
      } else if (rate.optGuarantee.split('.').length == 3) {
        if (rate.optGuaranteeType == 'total') {
          return `Gesamtpreisgarantie bis ${rate.optGuarantee}`
        } else if (rate.optGuaranteeType == "energyPrice") {
          return `Energiepreisgarantie bis ${rate.optGuarantee}`
        }else if (rate.optGuaranteeType == 'limitedEnergyPrice'){
          return `Eingeschränkte Preisgarantie bis ${rate.optGuarantee}`
        }
      } else {
        if (rate.optGuaranteeType == 'total') {
          return `${rate.optGuarantee} Monate Gesamtpreisgarantie`
        } else if (rate.optGuaranteeType == "energyPrice") {
          return `${rate.optGuarantee} Monate Energiepreisgarantie`
        } else if (rate.optGuaranteeType == 'limitedEnergyPrice'){
          return `${rate.optGuarantee} Monate Eingeschränkte Preisgarantie`
        }
      }
    }
  
    return ''
    
  }
  
  export function getTerm(rate: any) {
    if (Object.keys(rate).length > 0) {
      if (rate.optTerm == '0') {
        return 'keine Mindestlaufzeit'
      } else if (rate.optTerm.split('.').length == 3) {
        return `Mindestlaufzeit bis ${rate.optTerm}`
      } else {
        return `${rate.optTerm} Monate Mindestlaufzeit`
      }
    }
    return ''
  }
  
  
  export function getSavingPerYear(rate: any, IncludingBonus: any, energyService:any) {
    let savingPerYearClass = false
    let saving = 0
    let ratesData = {}
        ratesData = Object.assign({}, energyService.ratesData)
  
    if ('savingPerYear' in rate && 'totalPrice' in rate) {
      saving = rate.savingPerYear
  
      if (!('workPrice' in ratesData)) {
        savingPerYearClass = false
        return {
          saving: '-/-',
          savingPerYearClass: savingPerYearClass
        }
      }
  
      if (IncludingBonus) {
        if ('optBonus' in rate && rate.optBonus != 0) {
          saving = saving + rate.optBonus
        }
        if ('optBonusInstant' in rate && rate.optBonusInstant != 0) {
          saving = saving + rate.optBonusInstant
        }
      }
      if (saving > 0) {
        savingPerYearClass = true
        return {
          saving: saving.toFixed(2) + ' €',
          savingPerYearClass: savingPerYearClass
        }
      } else {
        savingPerYearClass = false
  
        return {
          saving: 'keine Ersparnis',
          savingPerYearClass: savingPerYearClass
        }
      }
    } else {
      savingPerYearClass = false
      return {
        saving: '',
        savingPerYearClass: savingPerYearClass
      }
    }
  }
  
  export function getBonus(rate: any) {
    let bonus = 0
    if ('optBonus' in rate && rate.optBonus != 0) {
      bonus = bonus + rate.optBonus
    }
    if ('optBonusInstant' in rate && rate.optBonusInstant != 0) {
      bonus = bonus + rate.optBonusInstant
    }
  
    return bonus
  }
  
  
  export function getTotalPriceMonth(rate: any) {
    if ('partialPayment' in rate && 'totalPriceWithoutBonus' in rate) {
      return (rate.totalPriceWithoutBonus / rate.partialPayment).toFixed(2)
    } else return false
  }
  