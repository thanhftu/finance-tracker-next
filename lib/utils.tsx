export const currencyFormatter = (currency:string,amount:number)=>{
    const formatter=Intl.NumberFormat("en-US",{
        currency:currency,
        style:"currency"
    });
    return formatter.format(amount)
}