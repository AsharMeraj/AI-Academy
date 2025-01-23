export interface subheadings {
    subheading: string,
    subheadingPara: string,
    codeBlock: string
}
export interface chapters {
    heading: string,
    headingPara: string,
    subheadings: subheadings[]
}
export interface AIGeneratedNotesType {
    chapters: chapters[]
} 