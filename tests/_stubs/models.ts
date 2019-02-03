import {Alias, Display, Email, Ignore} from "./attrs";
import {TypeOf} from "../../source";


@Alias('test')
export class Post
{

    @Alias('title')
    public title: string;

    public content: string;

    @Ignore
    public get date() {
        return new Date();
    }

}

export class Author
{

    public name: string;

    @Email()
    public email: string;

    public active: boolean;

    @Ignore
    public disable() {
        this.active = false;
    }

}

export class Comment
{

    @Alias('text')
    public content: string;

}

export class PromoPost extends Post
{

    // Inherited Alias attribute
    @TypeOf(String)
    public title: string;

    @TypeOf(String)
    public announce: string;

    public notify(@TypeOf(Author) user: Author) {

    }

}