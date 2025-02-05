export class UserRegistrationErrorResponseDto {

    message!: string;

    constructor(
        message: string,
    ) {
        this.message = message;
    }

}
