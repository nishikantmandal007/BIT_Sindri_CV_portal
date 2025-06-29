import React from 'react';
import { ResumeData, CustomSection, Publication, Experience, Project, Competition, Responsibility, CustomSectionItem } from '../types';
import { PhoneIcon, MailIcon, GithubIcon, LinkedinIcon } from './icons';

// A more compact, modern section component
const Section: React.FC<{ title: string; children: React.ReactNode, accentColor: string }> = ({ title, children, accentColor }) => (
    <section className="mb-2 break-inside-avoid">
        <h2
            className="text-center text-xs font-bold uppercase tracking-wider text-white py-0.5 mb-1.5"
            style={{ backgroundColor: accentColor }}
        >
            {title}
        </h2>
        {children}
    </section>
);

const BulletPoint: React.FC<{ htmlContent: string }> = ({ htmlContent }) => (
    <li className="flex items-start mb-0.5 text-sm leading-relaxed">
        <span className="mr-2.5 mt-1.5 text-slate-500 text-xs leading-tight">●</span>
        <div className="flex-1 text-gray-800" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </li>
);

interface ResumeContentProps {
    resumeData: ResumeData;
}

type MainSectionItem = Publication | Experience | Project | Competition | Responsibility | CustomSectionItem;

const ResumeContent: React.FC<ResumeContentProps> = ({ resumeData }) => {
    const {
        name, title, specialization, logoUrl, profileUrl, contact, sectionOrder, settings
    } = resumeData;

    const fontClass = {
        'Merriweather': 'font-serif',
        'Lato': 'font-lato',
        'Raleway': 'font-raleway',
        'Roboto Slab': 'font-roboto-slab',
    }[settings.fontFamily];

    const baseFontSize = `${settings.fontSize || '10'}pt`;

    const renderMainSectionItem = (item: MainSectionItem) => {
        const itemTitle = 'role' in item ? item.role : item.title;
        let subtitle = '';
        if ('company' in item) subtitle = `${item.company}, ${item.location}`;
        else if ('group' in item) subtitle = item.group;
        else if ('subtitle' in item) subtitle = item.subtitle;
        else if ('details' in item) subtitle = item.details;

        const date = 'duration' in item ? item.duration : item.date;

        return (
            <div key={item.id} className="mb-1.5 break-inside-avoid">
                <div className="flex justify-between items-start mb-0.5 gap-4">
                    <h3 className="font-bold text-base text-slate-800 flex-grow min-w-0">
                        {itemTitle}{subtitle && <span className="font-medium"> — {subtitle}</span>}
                    </h3>
                    <p className="font-medium text-sm text-slate-600 flex-shrink-0 whitespace-nowrap">{date}</p>
                </div>
                <ul className="list-none pl-1">
                    {item.points.map((point, pIdx) => <BulletPoint key={pIdx} htmlContent={point} />)}
                </ul>
            </div>
        );
    }

    const sectionRenderers: { [key: string]: React.ReactNode } = {
        education: resumeData.education.length > 0 && (
            <Section title="Education" accentColor={settings.accentColor}>
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b-2 border-slate-300">
                            <th className="p-1.5 font-bold">Year</th>
                            <th className="p-1.5 font-bold">Degree/Exam</th>
                            <th className="p-1.5 font-bold">Institute</th>
                            <th className="p-1.5 font-bold text-right">CGPA/Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumeData.education.map((edu) => (
                            <tr key={edu.id} className="border-b border-slate-200">
                                <td className="p-1.5">{edu.year}</td>
                                <td className="p-1.5">{edu.degree}</td>
                                <td className="p-1.5">{edu.institute}</td>
                                <td className="p-1.5 text-right">{edu.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>
        ),
        publications: resumeData.publications.length > 0 && (
            <Section title="Publications" accentColor={settings.accentColor}>
                {resumeData.publications.map(item => renderMainSectionItem(item))}
            </Section>
        ),
        internships: resumeData.internships.length > 0 && (
            <Section title="Internships" accentColor={settings.accentColor}>
                {resumeData.internships.map(item => renderMainSectionItem(item))}
            </Section>
        ),
        projects: resumeData.projects.length > 0 && (
            <Section title="Projects" accentColor={settings.accentColor}>
                {resumeData.projects.map(item => renderMainSectionItem(item))}
            </Section>
        ),
        competitions: resumeData.competitions.length > 0 && (
            <Section title="Competition/Conference" accentColor={settings.accentColor}>
                {resumeData.competitions.map(item => renderMainSectionItem(item))}
            </Section>
        ),
        awards: resumeData.awards.length > 0 && (
            <Section title="Awards and Achievements" accentColor={settings.accentColor}>
                <ul className="list-none pl-1">
                    {resumeData.awards.map(award => <BulletPoint key={award.id} htmlContent={award.point} />)}
                </ul>
            </Section>
        ),
        skills: resumeData.skills.length > 0 && (
            <Section title="Skills and Expertise" accentColor={settings.accentColor}>
                {resumeData.skills.map(skill => (
                    <div key={skill.id} className="flex text-sm mb-1">
                        <p className="font-bold w-40 flex-shrink-0 pr-2">{skill.category}</p>
                        <p className="flex-1">{skill.list}</p>
                    </div>
                ))}
            </Section>
        ),
        responsibilities: resumeData.responsibilities.length > 0 && (
            <Section title="Positions of Responsibility" accentColor={settings.accentColor}>
                {resumeData.responsibilities.map(item => renderMainSectionItem(item))}
            </Section>
        )
    };

    const renderCustomSection = (section: CustomSection) => (
        section.items.length > 0 && (
            <Section key={section.id} title={section.title} accentColor={settings.accentColor}>
                {section.items.map(item => renderMainSectionItem(item))}
            </Section>
        )
    );

    return (
        <div
            className={`bg-white shadow-lg ${fontClass} text-gray-800 p-8`}
            style={{
                width: '210mm',
                minHeight: '297mm',
                fontSize: baseFontSize,
                boxSizing: 'border-box'
            }}
        >
            <header className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
                {logoUrl &&
                    <div className="w-20 h-20 flex-shrink-0">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                }
                <div className="text-center flex-grow mx-4">
                    <h1 className="text-2xl font-bold tracking-wider" style={{ color: settings.accentColor }}>{name}</h1>
                    <p className="text-base font-semibold text-gray-700">{title}</p>
                    <p className="text-sm font-medium text-gray-600">{specialization}</p>
                    <div className="flex items-center justify-center gap-3 text-xs mt-2 text-slate-700">
                        <span className="flex items-center gap-1.5"><PhoneIcon className="w-3 h-3" />{contact.phone}</span>
                        <span className="flex items-center gap-1.5"><MailIcon className="w-3 h-3" />{contact.email}</span>
                        <span className="flex items-center gap-1.5"><GithubIcon className="w-3 h-3" />{contact.github}</span>
                        <span className="flex items-center gap-1.5"><LinkedinIcon className="w-3 h-3" />{contact.linkedin}</span>
                    </div>
                </div>
                {profileUrl &&
                    <div className="w-24 h-24 flex-shrink-0">
                        <img src={profileUrl} alt="Profile" className="w-full h-full object-cover rounded-md border-2 border-slate-200" />
                    </div>
                }
            </header>

            <main>
                {sectionOrder.map(key => {
                    if (key.startsWith('custom-')) {
                        const customSection = resumeData.customSections.find(s => s.id === key);
                        return customSection ? renderCustomSection(customSection) : null;
                    }
                    return sectionRenderers[key] || null;
                })}
            </main>
        </div>
    );
};

export default ResumeContent;