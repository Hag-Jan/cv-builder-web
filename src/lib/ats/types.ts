export interface AtsParserInput {
    html?: string;
    pdfBuffer?: Buffer;
    pdfUrl?: string;
}

export interface ParsedResume {
    basics?: {
        name?: string;
        email?: string;
        phone?: string;
        location?: string;
        url?: string;
    };
    work?: Array<{
        company?: string;
        position?: string;
        startDate?: string;
        endDate?: string;
        highlights?: string[];
    }>;
    education?: Array<{
        institution?: string;
        degree?: string;
        date?: string;
    }>;
    skills?: Array<{
        name?: string;
        keywords?: string[];
    }>;
    projects?: Array<{
        name?: string;
        description?: string;
        highlights?: string[];
    }>;
}

export interface AtsReport {
    coverageScore: number;
    sectionCoverage: Record<string, number>;
    warnings: string[];
    diff?: {
        missingFields: Array<{ path: string; expected: any }>;
        mismatchedSections: Array<{ type: string; message: string }>;
    };
    parsedResume?: ParsedResume;
}

export interface AtsParser {
    engineId: string;
    parse(input: AtsParserInput): Promise<ParsedResume>;
}
