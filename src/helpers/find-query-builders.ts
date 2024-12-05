export function buildFindUsersQuery(searchLoginTerm: string | null, searchEmailTerm: string | null) {
    const conditions: any[] = [];

    if (searchLoginTerm) {
        conditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    if (searchEmailTerm) {
        conditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    return conditions.length ? { $or: conditions } : {};
}