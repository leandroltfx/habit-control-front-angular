export class RecoverPasswordRequestContract {

    email!: string;

    constructor(
        email: string
    ) {
        this.email = email;
    }

}
