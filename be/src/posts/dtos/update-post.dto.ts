import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
    title?: string;
    content?: string;
}
//odi dodat jos stvari jer moze img,datoteke dodavat i provjera jeli prazno ili nije
// novi komentar