import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
}

export async function comparePassword(password, userPassword) {
    const compare = await bcrypt.compare(password, userPassword);

    return compare;
}