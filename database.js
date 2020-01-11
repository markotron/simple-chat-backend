const _ = require("lodash");

class Database {

    constructor() {
        this.db = [];
        this.readMap = new Map();
        this.starredMessages = new Map();
    }

    addMessage(message) {
        this.db.push(message);
    }

    getLastMessages(userId, count) {
        return this._getLastElements(userId, count, this.db);
    }

    getMessagesBefore(userId, uuid, count) {
        const lastIndex = this.db.findIndex((message) => message.id === uuid);
        const olderMessages = this.db.slice(0, lastIndex);
        return this._getLastElements(userId, count, olderMessages);
    }

    setLastReadMessageForUser(userId, lastReadMessageId) {
        userId = String(userId);
        this.readMap.set(userId, lastReadMessageId);
    }

    getLastReadMessageForUser(userId) {
        return this.readMap.get(String(userId));
    }

    getStarredMessages(userId, beforeId, count) {
        console.log(beforeId);
        const starredIds = this.starredMessages.get(userId);
        if(starredIds === undefined) return [];
        const starredMessages = this.db.filter((m) => starredIds.has(m.id));
        const olderMessages = beforeId ? _.takeWhile(starredMessages, (m) => m.id !== beforeId) : starredMessages;
        console.log(olderMessages);
        return _.takeRight(olderMessages, count);
    }

    toggleMessageStar(userId, messageId) {
        userId = String(userId);
        const userStars = this.starredMessages.get(userId);
        if (userStars == null) {
            this.starredMessages.set(userId, new Set().add(messageId));
            return;
        }
        if (userStars.has(messageId)) userStars.delete(messageId);
        else userStars.add(messageId);
    }

    _getLastElements(userId, count, array) {
        const len = array.length;
        let messages;
        if (len <= count) messages = array;
        else messages = array.slice(len - count);
        const stars = this.starredMessages.get(userId);
        if (stars == null) return messages;
        return messages.map((m) => stars.has(m.id) ? {...m, isStarred: true} : m);
    }

}

module.exports = new Database();
