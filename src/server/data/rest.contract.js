//This allows you to be more flexible with return type names
//TODO: Normalize ID here?

var logger = require('../utils/logger.js');

var service = {
    Get: Get,
    GetById: GetById,
    Post: Post,
    PostById: PostById,
    Put: Put,
    PutById: PutById,
    Delete: Delete,
    DeleteById: DeleteById,
    Error: Error
};

var errorPrefix = 'REST Contract Error: ';

function Get(items) { //array of objects
    if (Array.isArray(items)) {
        this.items = items;
    } else {
        this.error = errorPrefix + 'GET must return array';
    }
}

function GetById(item) { //a single object
    if ((typeof item === 'object') && (item !== null)) {
        this.item = item;
    } else {
        throw errorPrefix + 'GetById must return an object';
    }
}

function Post(ids) { //array of ids
    if (Array.isArray(ids)) {
        this.ids = ids;
    } else {
        this.error = errorPrefix + 'POST must return array';
    }
}

function PostById(id) { //single id
    console.log(id);
    if ((typeof id === 'object') || Array.isArray(id)) {
        this.error = errorPrefix + 'PostById must return an id';
    } else {
        this.id = id;
    }
}

function Put(ids) { //array of objects with Id and Success
    if (Array.isArray(ids)) {
        this.ids = ids;
    } else {
        this.error = errorPrefix + 'POST must return array';
    }
}

function PutById(idSuccess) { //a single object with Id and Success
    if (idSuccess.id && idSuccess.success) {
        this.id = idSuccess.id;
        this.success = idSuccess.success;
    } else {
        this.error = errorPrefix + 'PutById must return an object with id and success';
    }
}

function Delete(ids) { //array of objects with Id and Success
    if (Array.isArray(ids)) {
        this.ids = ids;
    } else {
        this.error = errorPrefix + 'DELETE must return an array';
    }
}

function DeleteById(idSuccess) { //a single object with Id and Success
    if (idSuccess.id && idSuccess.success) {
        this.id = idSuccess.id;
        this.success = idSuccess.success;
    } else {
        this.error = errorPrefix + 'DeleteById must return an object with id and success';
    }
}

function Error(error) { //a string
    this.error = error;
}

module.exports = service;
