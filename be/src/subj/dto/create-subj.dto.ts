import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";


export class CreateSubjDto {
    @IsString()
    title: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    ratingExpectation: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    ratingDifficulty: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    ratingPracticality: number;

    @IsNumber()
    idNositelja: number;

    @IsNumber()
    idAuditornih: number;
}
