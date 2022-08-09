const getExpenses = (req: any, res: any) => {
    return req.user.getExpenses();
}

export default getExpenses;