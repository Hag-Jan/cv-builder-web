import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type {
    ResumeV2 as Resume,
    ContactSectionV2 as ContactSection,
    ExperienceSectionV2 as ExperienceSection,
    EducationSectionV2 as EducationSection,
    SkillsSectionV2 as SkillsSection,
    ProjectsSectionV2 as ProjectsSection,
    CustomSectionV2 as CustomSection,
    SummarySection
} from '@/types/resume-schema-v2';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#000000',
    },
    header: {
        marginBottom: 20,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactInfo: {
        fontSize: 10,
        lineHeight: 1.4,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 2,
        marginBottom: 8,
    },
    experienceItem: {
        marginBottom: 10,
    },
    roleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    role: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    companyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    company: {
        fontSize: 10,
        fontStyle: 'italic',
    },
    dateRange: {
        fontSize: 9,
        color: '#333333',
    },
    location: {
        fontSize: 9,
        color: '#666666',
    },
    summaryText: {
        fontSize: 10,
        lineHeight: 1.4,
    },
    educationItem: {
        marginBottom: 8,
    },
    school: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    degree: {
        fontSize: 11,
    },
    skillCategory: {
        marginBottom: 6,
    },
    skillLabel: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    skillContent: {
        fontSize: 10,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    techStack: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 2,
    },
    customContent: {
        fontSize: 10,
        marginBottom: 2,
    },
    bulletList: {
        marginLeft: 15,
        marginTop: 4,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.3,
    },
});

interface ClassicTemplateProps {
    resume: Resume;
}

const ClassicTemplate = ({ resume }: ClassicTemplateProps) => {
    const contactSection = resume.sections.find(s => s.type === 'contact') as ContactSection | undefined;
    const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);

    return (
        <Document title={`${contactSection?.name || 'Resume'} - Classic ATS`}>
            <Page size="A4" style={styles.page}>
                {/* Contact Information */}
                {contactSection && (
                    <View style={styles.header}>
                        <Text style={styles.name}>{contactSection.name}</Text>
                        <View style={styles.contactInfo}>
                            <Text>{[contactSection.email, contactSection.phone, contactSection.location].filter(Boolean).join('  •  ')}</Text>
                            {(contactSection.linkedin || contactSection.github || contactSection.website) && (
                                <Text style={{ color: '#444444' }}>
                                    {[
                                        contactSection.linkedin?.replace(/^https?:\/\//, ''),
                                        contactSection.github?.replace(/^https?:\/\//, ''),
                                        contactSection.website?.replace(/^https?:\/\//, '')
                                    ].filter(Boolean).join('  •  ')}
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {/* Render sections in order */}
                {sortedSections.map((section) => {
                    if (section.type === 'contact') return null;

                    return (
                        <View key={section.id} style={styles.section} wrap={true}>
                            {/* Summary Section */}
                            {section.type === 'summary' && (
                                <>
                                    <Text style={styles.sectionTitle}>Summary</Text>
                                    <Text style={styles.summaryText}>{(section as SummarySection).content}</Text>
                                </>
                            )}

                            {/* Experience Section */}
                            {section.type === 'experience' && (
                                <>
                                    <Text style={styles.sectionTitle}>Experience</Text>
                                    {(section as ExperienceSection).items.map((item) => (
                                        <View key={item.id} style={styles.experienceItem}>
                                            <View style={styles.roleRow}>
                                                <Text style={styles.role}>{item.role}</Text>
                                                <Text style={styles.dateRange}>
                                                    {item.startDate} - {item.endDate || 'Present'}
                                                </Text>
                                            </View>
                                            <View style={styles.companyRow}>
                                                <Text style={styles.company}>{item.company}</Text>
                                                {item.location && <Text style={styles.location}>{item.location}</Text>}
                                            </View>
                                            {item.bullets && item.bullets.length > 0 && (
                                                <View style={styles.bulletList}>
                                                    {item.bullets.map((bullet, idx) => (
                                                        <View key={idx} style={styles.bulletItem}>
                                                            <Text style={styles.bulletPoint}>•</Text>
                                                            <Text style={styles.bulletText}>{bullet}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Education Section */}
                            {section.type === 'education' && (
                                <>
                                    <Text style={styles.sectionTitle}>Education</Text>
                                    {(section as EducationSection).items.map((item) => (
                                        <View key={item.id} style={styles.educationItem}>
                                            <View style={styles.roleRow}>
                                                <Text style={styles.school}>{item.school}</Text>
                                                <Text style={styles.dateRange}>{item.date}</Text>
                                            </View>
                                            <Text style={styles.degree}>{item.degree}</Text>
                                            {(item.gpa || item.honors) && (
                                                <Text style={styles.dateRange}>
                                                    {[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(' | ')}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Skills Section */}
                            {section.type === 'skills' && (
                                <>
                                    <Text style={styles.sectionTitle}>Skills</Text>
                                    {(section as SkillsSection).categories.map((category) => (
                                        <View key={category.id} style={styles.skillCategory}>
                                            <Text style={styles.skillLabel}>{category.label}:</Text>
                                            <Text style={styles.skillContent}>{category.skills.join(', ')}</Text>
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Projects Section */}
                            {section.type === 'projects' && (section as ProjectsSection).items.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Projects</Text>
                                    {(section as ProjectsSection).items.map((item) => (
                                        <View key={item.id} style={styles.experienceItem}>
                                            <View style={styles.projectHeader}>
                                                <Text style={styles.role}>{item.name}</Text>
                                                {item.link && <Text style={styles.dateRange}>{item.link.replace(/^https?:\/\//, '')}</Text>}
                                            </View>
                                            {item.techStack && item.techStack.length > 0 && (
                                                <Text style={styles.techStack}>Tech Stack: {item.techStack.join(', ')}</Text>
                                            )}
                                            {item.description && (
                                                <Text style={styles.bulletText}>{item.description}</Text>
                                            )}
                                            {item.bullets && item.bullets.length > 0 && (
                                                <View style={styles.bulletList}>
                                                    {item.bullets.map((bullet, idx) => (
                                                        <View key={idx} style={styles.bulletItem}>
                                                            <Text style={styles.bulletPoint}>•</Text>
                                                            <Text style={styles.bulletText}>{bullet}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Custom Section */}
                            {section.type === 'custom' && (
                                <>
                                    <Text style={styles.sectionTitle}>{(section as CustomSection).title}</Text>
                                    {(section as CustomSection).content.map((item, idx) => (
                                        <Text key={idx} style={styles.customContent}>{item}</Text>
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

export default ClassicTemplate;
