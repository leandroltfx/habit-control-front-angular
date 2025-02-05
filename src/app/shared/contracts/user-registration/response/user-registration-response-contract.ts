import { LoggedUserModel } from "../../../../shared/models/logged-user/logged-user-model";

export class UserRegistrationResponseContract {

    message!: string;
    user!: LoggedUserModel;

    constructor(
        message: string,
        user: LoggedUserModel,
    ) {
        this.message = message;
        this.user = user;
    }

}
