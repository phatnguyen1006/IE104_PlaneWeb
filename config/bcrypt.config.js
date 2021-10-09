const express = require('express');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);

module.exports = {
    encrypt: async password => {
        return await bcrypt.hash(password, salt);
    },
    compareCrypt: async (password, hash) => {
        return await bcrypt.compare(password, hash)
            .then(result => {
                return result;
            })
            .catch((err) => {
                throw new Error(err);
            })
    }
};