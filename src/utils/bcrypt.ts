// BYIMAAN

import bcrypt from 'bcryptjs';

async function hashPassword(password: string){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

type ComparePassword = {
    password : string,
    hashedPassword: string
}

async function comparePassword({password, hashedPassword}: ComparePassword){
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

export {hashPassword, comparePassword}