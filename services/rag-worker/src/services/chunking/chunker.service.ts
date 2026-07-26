import { splitSection } from "./semantic-splitter.service";

export function chunkContent(content:any) {

    const chunks:any[] = [];

    for(const section of content.sections) {
        const sectionChunks = splitSection(section.heading,section.content);

        chunks.push(...sectionChunks);
    }

    return chunks.map(
        (chunk,index) =>({
            content: chunk.content,
            chunkIndex: index,
            tokenCount: chunk.tokenCount
        })
    );
}