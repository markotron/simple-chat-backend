const _ = require("lodash");

class Database {

    constructor() {
        this.db = [
            {
                id: '51c5c81b-1402-46cc-8693-94b01f6a23e8',
                message: "Hello, it's me",
                isStarred: false,
                userId: 0
            },
            {
                id: '6410d5e1-a0bd-44fb-a6b2-f5100839dfda',
                message: 'I was wondering if',
                isStarred: false,
                userId: 0
            },
            {
                id: '345f3821-be74-49d1-8f94-64b2e9148719',
                message: "after all these years you'd like to",
                isStarred: false,
                userId: 0
            },
            {
                id: '3fa79bee-58d0-4c68-ad4c-0ce99130ef91',
                message: 'meet?',
                isStarred: false,
                userId: 1
            },
            {
                id: 'f5db1507-17a2-44c3-b81c-abf8411a0b33',
                message: 'To go over everything?',
                isStarred: false,
                userId: 1
            },
            {
                id: '0d9bf055-3d36-4569-a19f-dda37c950d8c',
                message: "They say that time's supposed",
                isStarred: false,
                userId: 1
            },
            {
                id: 'f6aef094-6cf3-4f54-8e90-c7ca63a637a2',
                message: "to heal ya, but I ain't",
                isStarred: false,
                userId: 1
            },
            {
                id: '922f4206-5b7d-4347-9c69-5d1dc00f2d07',
                message: 'done much healing',
                isStarred: false,
                userId: 1
            },
            {
                id: '8835bcd2-557c-4aaa-9342-8335410e0955',
                message: '...',
                isStarred: false,
                userId: 1
            },
            {
                id: 'c12bb267-9186-41e4-870b-da5f338da35e',
                message: 'Hello, can you hear me?',
                isStarred: false,
                userId: 0
            }];
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
        if (starredIds === undefined) return [];
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
