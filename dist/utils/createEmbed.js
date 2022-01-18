"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Embed {
    title;
    color;
    description;
    id;
    constructor(id, title, color, description) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.description = description;
    }
    get getTitle() {
        return this.title;
    }
    get getColor() {
        return this.color;
    }
    get getDescription() {
        return this.description;
    }
    build() {
        return {
            color: this.getColor,
            title: this.getTitle,
            description: this.getDescription,
        };
    }
}
exports.default = Embed;
