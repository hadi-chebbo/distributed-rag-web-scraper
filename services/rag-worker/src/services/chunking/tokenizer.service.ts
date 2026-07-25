import { encode, decode } from "gpt-tokenizer";

export function tokenize(text: string) {
    return encode(text);
}

export function detokenize(tokens: number[]) {
    return decode(tokens);
}