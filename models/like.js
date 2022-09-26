class Like {

    constructor(author_id, entity_id, entity, type) {
        this.author_id = author_id;
        this.entity_id = entity_id;
        this.entity = entity;
        this.type = type;
    }

    
    getAuthorId() {
        return this.author_id;
    }

    getEntityId() {
        return this.entity_id;
    }

    getEntity() {
        return this.entity;
    }

    getType() {
        return this.type;
    }

}

module.exports = Like;
