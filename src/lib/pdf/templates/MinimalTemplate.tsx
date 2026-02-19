import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type {
    ResumeV2 as Resume,
    ContactSectionV2 as ContactSection,
    ExperienceSectionV2 as ExperienceSection,
    EducationSectionV2 as EducationSection,
    SkillsSectionV2 as SkillsSection,
    ProjectsSectionV2 as ProjectsSection,
    CustomSectionV2 as CustomSection,
    SummarySection
} from "@/types/resume-schema-v2";

// ─────────────────────────────────────────────────────────
// Minimal PDF Template — Updated for ResumeV2
// Ultra-clean, single-column, no borders, generous whitespace.
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 48,
        fontFamily: "Helvetica",
        color: "#374151",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    contactLine: {
        fontSize: 9,
        color: "#6B7280",
        marginBottom: 2,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#111827",
        letterSpacing: 1,
        marginTop: 16,
        marginBottom: 6,
    },
    summaryText: {
        fontSize: 10,
        lineHeight: 1.4,
        color: "#4B5563",
    },
    itemTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#111827",
    },
    itemSubtitle: {
        fontSize: 9,
        color: "#6B7280",
    },
    body: {
        fontSize: 9,
        lineHeight: 1.4,
        color: "#374151",
    },
    bulletItem: {
        flexDirection: "row",
        marginBottom: 2,
        paddingLeft: 8,
    },
    bulletDot: {
        width: 8,
        fontSize: 9,
        color: "#9CA3AF",
    },
    bulletText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 1.4,
        color: "#374151",
    },
    techStack: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#9CA3AF",
        marginBottom: 2,
    },
    gap: {
        marginBottom: 8,
    },
});

interface MinimalTemplateProps {
    resume: Resume;
}

const MinimalTemplate = ({ resume }: MinimalTemplateProps) => {
    const contact = resume.sections.find((s) => s.type === "contact") as ContactSection | undefined;
    const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <Document title={`${contact?.name || "Resume"} — Minimal`}>
            <Page size="A4" style={styles.page}>
                {/* Contact */}
                {contact && (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={styles.name}>{contact.name}</Text>
                        <Text style={styles.contactLine}>
                            {[contact.email, contact.phone, contact.location]
                                .filter(Boolean)
                                .join("  •  ")}
                        </Text>
                        {(contact.linkedin || contact.github || contact.website) && (
                            <Text style={styles.contactLine}>
                                {[
                                    contact.linkedin?.replace(/^https?:\/\//, ''),
                                    contact.github?.replace(/^https?:\/\//, ''),
                                    contact.website?.replace(/^https?:\/\//, '')
                                ].filter(Boolean).join('  •  ')}
                            </Text>
                        )}
                    </View>
                )}

                {sorted.map((section) => {
                    if (section.type === "contact") return null;

                    return (
                        <View key={section.id}>
                            {/* Summary */}
                            {section.type === "summary" && (
                                <>
                                    <Text style={styles.sectionTitle}>Summary</Text>
                                    <Text style={styles.summaryText}>{(section as SummarySection).content}</Text>
                                </>
                            )}

                            {/* Experience */}
                            {section.type === "experience" && (
                                <>
                                    <Text style={styles.sectionTitle}>Experience</Text>
                                    {(section as ExperienceSection).items.map((item) => (
                                        <View key={item.id} style={styles.gap}>
                                            <Text style={styles.itemTitle}>{item.role}</Text>
                                            <Text style={styles.itemSubtitle}>
                                                {item.company} {item.location && `· ${item.location}`} · {item.startDate} – {item.endDate || "Present"}
                                            </Text>
                                            {item.bullets?.map((b, i) => (
                                                <View key={i} style={styles.bulletItem}>
                                                    <Text style={styles.bulletDot}>·</Text>
                                                    <Text style={styles.bulletText}>{b}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Education */}
                            {section.type === "education" && (
                                <>
                                    <Text style={styles.sectionTitle}>Education</Text>
                                    {(section as EducationSection).items.map((item) => (
                                        <View key={item.id} style={styles.gap}>
                                            <Text style={styles.itemTitle}>{item.school}</Text>
                                            <Text style={styles.itemSubtitle}>
                                                {item.degree} · {item.date}
                                            </Text>
                                            {(item.gpa || item.honors) && (
                                                <Text style={styles.itemSubtitle}>
                                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(' | ')}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Skills */}
                            {section.type === "skills" && (
                                <>
                                    <Text style={styles.sectionTitle}>Skills</Text>
                                    {(section as SkillsSection).categories.map((cat) => (
                                        <View key={cat.id} style={{ marginBottom: 3 }}>
                                            <Text style={styles.body}>
                                                <Text style={{ fontWeight: "bold" }}>{cat.label}: </Text>
                                                {cat.skills.join(", ")}
                                            </Text>
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Projects */}
                            {section.type === "projects" &&
                                (section as ProjectsSection).items.length > 0 && (
                                    <>
                                        <Text style={styles.sectionTitle}>Projects</Text>
                                        {(section as ProjectsSection).items.map((item) => (
                                            <View key={item.id} style={styles.gap}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={styles.itemTitle}>{item.name}</Text>
                                                    {item.link && <Text style={styles.itemSubtitle}>{item.link.replace(/^https?:\/\//, '')}</Text>}
                                                </View>
                                                {item.techStack && item.techStack.length > 0 && (
                                                    <Text style={styles.techStack}>Tech: {item.techStack.join(', ')}</Text>
                                                )}
                                                {item.description && (
                                                    <Text style={styles.body}>{item.description}</Text>
                                                )}
                                                {item.bullets?.map((b, i) => (
                                                    <View key={i} style={styles.bulletItem}>
                                                        <Text style={styles.bulletDot}>·</Text>
                                                        <Text style={styles.bulletText}>{b}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </>
                                )}

                            {/* Custom */}
                            {section.type === "custom" && (
                                <>
                                    <Text style={styles.sectionTitle}>
                                        {(section as CustomSection).title}
                                    </Text>
                                    {(section as CustomSection).content.map((c, i) => (
                                        <Text key={i} style={styles.body}>
                                            {c}
                                        </Text>
                                    ))}
                                </>
                            )}
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};

export default MinimalTemplate;
