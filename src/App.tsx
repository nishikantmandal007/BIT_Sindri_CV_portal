


import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ResumeData, Education, Experience, Publication, Project, Competition, Responsibility, Award, Skill, CustomSection, CustomSectionItem, ResumeSettings } from './types';
import ResumeContent from './components/ResumeContent';
import Editor from './components/Editor';
import { LayoutSidebarLeftCollapse, LayoutSidebarLeftExpand } from './components/icons';

const defaultLogoUrl = 'public/images/BIT_Sindri_logo.png';
const defaultProfileUrl = 'public/images/pp.jpg';

const initialResumeData: ResumeData = {
    name: 'ΑΝΟΝ ΑΝΟΝ ΑΝΟΝ — 21AB00000',
    title: 'ΑΝΟΝ ΑΝΟΝ (M.Tech Dual 5Y)',
    specialization: 'MICRO SPL. in ANON INTELLigence AND APPLICATIONS',
    logoUrl: defaultLogoUrl,
    profileUrl: defaultProfileUrl,
    contact: {
        phone: '+91 1234567890',
        email: 'anonemail@example.com',
        github: 'anonhandle',
        linkedin: 'anon-linkedin'
    },
    settings: {
        fontFamily: 'Merriweather',
        fontSize: '10',
        accentColor: '#4A5568',
    },
    education: [
        { id: 'edu1', year: '2026', degree: 'ANON Dual Degree 5Y', institute: 'ANON University', score: '8.46 / 10' },
        { id: 'edu2', year: '2021', degree: 'ΑΝΟΝ (School) Certificate', institute: 'ANON Higher Secondary School', score: '98.6%' },
        { id: 'edu3', year: '2019', degree: 'ANON Certificate of Secondary Education', institute: 'ANON School', score: '98.4%' }
    ],
    publications: [
        { id: 'pub1', title: 'ANON: A Generalised Framework for Tooling', details: 'ΑΝΟΝ 2024 — ΑΝΟΝ, Greece', date: 'May 2024', points: ['Proposed a pipeline for ANON usage, achieving a 20% improvement over current SoTA benchmarks like ANON and ANON.', 'Employed ANON techniques to fine-tune models, reducing computational costs by 30%, optimizing resource usage.', 'Developed synthetic datasets for diverse scenarios, increasing model adaptability by 15% after fine-tuning.'] }
    ],
    internships: [
        { id: 'exp1', role: 'Data Science Intern', company: 'ANON', location: 'Bengaluru', duration: 'Jul 2024 - Present', points: ['Developed an ANON model to estimate demand volume, enhancing forecasting capabilities.', 'Achieved a 15% reduction in ANON Error through advanced optimization techniques.', 'Improved operational efficiency, resulting in a 5% reduction in ANON consumption.'] },
        { id: 'exp2', role: 'Data Engineer', company: 'ANON', location: 'San Francisco', duration: 'Jul 2024 - Present', points: ['Created a dataset of size 100,000 to fine-tune models for solving complex problems.', 'Implemented preprocessing techniques, increasing model accuracy by filtering irrelevant data.', 'Automated pipelines, reducing total preparation time and enabling faster iterations.'] },
        { id: 'exp3', role: 'Research Intern', company: 'ΑΝΟΝ', location: 'Bengaluru', duration: 'Jan 2024 - Mar 2024', points: ['Published the paper "ANON: A Generalised Framework for Tooling,” detailing a pipeline for ANON application.', 'Developed an agent for ANON, successfully merging an approved PR into the repository.', 'Conducted experiments achieving a 25% latency reduction using quantization methods.'] },
        { id: 'exp4', role: 'Machine Learning Engineer', company: 'ANON', location: 'Bengaluru', duration: 'Dec 2022 - Jan 2024', points: ['Implemented robust ML systems leveraging Python libraries for ANON tasks.', 'Fine-tuned models such as ANON and ANON to meet client-specific goals.', 'Applied pre-trained models for tasks like classification and segmentation.'] }
    ],
    projects: [
        { id: 'proj1', title: 'Research Intern', details: 'ΑΝΟΝ — ΑΝΟΝ', date: 'Jun 2023 - Oct 2023', points: ['Conducted comprehensive analysis leveraging techniques to assess risks effectively.', 'Developed architectures to create models capable of extracting insights.', 'Enhanced rating models by integrating calculated factors.'] },
        { id: 'proj2', title: 'Intern', details: 'ΑΝΟΝ — Mumbai', date: 'May 2023 - Jun 2023', points: ['Developed a model with 97% F1 score for preserved texts, focusing on AΝΟΝ.', 'Implemented bounding box generation, enhancing accuracy of segmentation.', 'Identified 92% characters in the "ANON" dataset.'] },
        { id: 'proj3', title: 'ANON: An Al-powered Chat Bot', details: 'Self Project', date: 'Feb 2024', points: ['Developed ANON using quantized ANON models. Scraped data to create databases.', 'Designed and deployed an app to showcase ANON, ensuring seamless interaction.'] }
    ],
    competitions: [
        { id: 'comp1', title: 'ANON Campus Challenge 2024', date: 'May 2024 - Present', points: ['Ranked top 10 among teams in Round 1 by achieving 72% accuracy using models.'] },
        { id: 'comp2', title: "ANON's Al Agent: Tooling Up for Success", date: 'Nov 2023 - Jan 2024', points: ['Ranked 1st among teams, developing a novel method transforming selection into completion.'] }
    ],
    awards: [
        { id: 'award1', point: 'Recognized by ANON for contributions and insights shared within the community.' },
        { id: 'award2', point: 'Qualified for ANON Olympiad in 2017-18, demonstrating aptitude.' },
        { id: 'award3', point: 'Cleared the ANON Examination in 2017-18, showcasing abilities and prowess.' },
        { id: 'award4', point: 'Secured gold in Open ANON 2024 with a project focused on analysis.' }
    ],
    skills: [
        { id: 'skill1', category: 'Tools:', list: 'ANON, ANON, ΑΝOΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟN' },
        { id: 'skill2', category: 'Languages & Libraries:', list: 'ANΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ, ΑΝΟΝ' }
    ],
    responsibilities: [
        { id: 'resp1', role: 'Executive Head', group: 'ANON Group', duration: 'Jul 2023 - Jun 2024', points: ['Organized ANON Hackathon 2024, increasing registrations significantly.', 'Conducted a Bootcamp, attracting participants, including international ones.'] }
    ],
    customSections: [],
    sectionOrder: ['education', 'publications', 'internships', 'projects', 'competitions', 'awards', 'skills', 'responsibilities'],
};

// Helper to move item in an array immutably
const moveItemInArray = <T extends any>(array: T[], fromIndex: number, toIndex: number): T[] => {
    const newArray = [...array];
    const [item] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, item);
    return newArray;
};

const sanitizeText = (text: string): string => {
    if (!text) return '';
    // Replace problematic Unicode characters with standard ASCII equivalents
    return text
        .replace(/—|–/g, '-')       // Em-dash and En-dash to hyphen
        .replace(/‘|’/g, "'")       // Smart single quotes to apostrophe
        .replace(/“|”/g, '"')       // Smart double quotes to standard quote
        .replace(/•/g, '-')         // Bullet to hyphen
        .replace(/Α|Ά/g, 'A')       // Greek Alpha
        .replace(/Ν/g, 'N')         // Greek Nu
        .replace(/Ο|Ό/g, 'O');      // Greek Omicron
};

const stripAndSanitizeHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || "";
    return sanitizeText(textContent);
};


const App: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        try {
            const saved = localStorage.getItem('resumeData');
            return saved ? JSON.parse(saved) : initialResumeData;
        } catch (error) {
            console.error("Failed to load resume data", error);
            return initialResumeData;
        }
    });

    const [editorVisible, setEditorVisible] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const mainRef = useRef<HTMLElement>(null);
    const resumeWrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, [resumeData]);

    useEffect(() => {
        const mainEl = mainRef.current;
        const resumeEl = resumeWrapperRef.current;
        if (!mainEl || !resumeEl) return;

        const calculateScale = () => {
            const containerWidth = mainEl.offsetWidth;
            const availableWidth = containerWidth - 48; // p-6 = 24px each side

            const contentEl = resumeEl.firstElementChild as HTMLElement;
            if (!contentEl) return;

            const contentWidth = contentEl.offsetWidth;
            if (contentWidth > 0 && availableWidth > 0) {
                const newScale = availableWidth / contentWidth;
                setScale(newScale);
            }
        };

        const resizeObserver = new ResizeObserver(calculateScale);
        resizeObserver.observe(mainEl);

        // Initial calculation with a small delay for layout stabilization.
        const timerId = setTimeout(calculateScale, 100);

        return () => {
            clearTimeout(timerId);
            resizeObserver.disconnect();
        };
    }, [editorVisible]);

    const handleUpdateState = (key: keyof ResumeData, value: any) => {
        setResumeData(prev => ({ ...prev, [key]: value }));
    };

    const handleUpdateContact = (field: keyof typeof resumeData.contact, value: string) => {
        setResumeData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    };

    const handleUpdateImage = (field: 'logoUrl' | 'profileUrl', value: string) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdateSettings = (field: keyof ResumeSettings, value: any) => {
        setResumeData(prev => ({ ...prev, settings: { ...prev.settings, [field]: value } }));
    };

    const handleUpdateListItem = (section: keyof ResumeData, id: string, field: string, value: any) => {
        setResumeData(prev => {
            const list = prev[section as keyof Omit<ResumeData, 'contact' | 'settings' | 'sectionOrder'>] as any[];
            const newList = list.map(item => item.id === id ? { ...item, [field]: value } : item);
            return { ...prev, [section]: newList };
        });
    };

    const handleUpdateListItemPoint = (section: keyof ResumeData, itemId: string, pointIndex: number, value: string) => {
        setResumeData(prev => {
            const list = prev[section as keyof Omit<ResumeData, 'contact' | 'settings' | 'sectionOrder'>] as any[];
            const newList = list.map(item => {
                if (item.id === itemId && item.points) {
                    const newPoints = [...item.points];
                    newPoints[pointIndex] = value;
                    return { ...item, points: newPoints };
                }
                return item;
            });
            return { ...prev, [section]: newList };
        });
    };

    const handleAddListItemPoint = (section: keyof ResumeData, itemId: string) => {
        setResumeData(prev => {
            const list = prev[section as keyof Omit<ResumeData, 'contact' | 'settings' | 'sectionOrder'>] as any[];
            const newList = list.map(item => {
                if (item.id === itemId && item.points) {
                    return { ...item, points: [...item.points, 'New point'] };
                }
                return item;
            });
            return { ...prev, [section]: newList };
        });
    };

    const handleDeleteListItemPoint = (section: keyof ResumeData, itemId: string, pointIndex: number) => {
        setResumeData(prev => {
            const list = prev[section as keyof Omit<ResumeData, 'contact' | 'settings' | 'sectionOrder'>] as any[];
            const newList = list.map(item => {
                if (item.id === itemId && item.points) {
                    const newPoints = item.points.filter((_, index) => index !== pointIndex);
                    return { ...item, points: newPoints };
                }
                return item;
            });
            return { ...prev, [section]: newList };
        });
    };

    const handleAddListItem = (section: keyof ResumeData) => {
        setResumeData(prev => {
            const list = prev[section as keyof Omit<ResumeData, 'contact' | 'settings' | 'sectionOrder'>] as any[];
            let newItem: any;
            const id = `${section}-${Date.now()}`;
            switch (section) {
                case 'education': newItem = { id, year: '', degree: '', institute: '', score: '' }; break;
                case 'publications': newItem = { id, title: '', details: '', date: '', points: [''] }; break;
                case 'internships': newItem = { id, role: '', company: '', location: '', duration: '', points: [''] }; break;
                case 'projects': newItem = { id, title: '', details: '', date: '', points: [''] }; break;
                case 'competitions': newItem = { id, title: '', date: '', points: [''] }; break;
                case 'awards': newItem = { id, point: 'New Award' }; break;
                case 'skills': newItem = { id, category: '', list: '' }; break;
                case 'responsibilities': newItem = { id, role: '', group: '', duration: '', points: [''] }; break;
                default: return prev;
            }
            return { ...prev, [section]: [...list, newItem] };
        });
    };

    const handleDeleteListItem = (section: keyof ResumeData, id: string) => {
        setResumeData(prev => {
            const list = prev[section as keyof Omit<ResumeData, 'contact' | 'settings' | 'sectionOrder'>] as any[];
            const newList = list.filter(item => item.id !== id);
            return { ...prev, [section]: newList };
        });
    };

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        setResumeData(prev => {
            const toIndex = direction === 'up' ? index - 1 : index + 1;
            if (toIndex < 0 || toIndex >= prev.sectionOrder.length) return prev;
            return { ...prev, sectionOrder: moveItemInArray(prev.sectionOrder, index, toIndex) };
        });
    };

    const handleMoveListItem = (sectionKey: keyof ResumeData, index: number, direction: 'up' | 'down') => {
        setResumeData(prev => {
            const list = prev[sectionKey as keyof Omit<ResumeData, 'contact' | 'settings' | 'sectionOrder'>] as any[];
            const toIndex = direction === 'up' ? index - 1 : index + 1;
            if (toIndex < 0 || toIndex >= list.length) return prev;
            return { ...prev, [sectionKey]: moveItemInArray(list, index, toIndex) };
        });
    };

    const handleAddCustomSection = () => {
        const newSection: CustomSection = {
            id: `custom-${Date.now()}`,
            title: 'New Section',
            items: []
        };
        setResumeData(prev => ({
            ...prev,
            customSections: [...prev.customSections, newSection],
            sectionOrder: [...prev.sectionOrder, newSection.id]
        }));
    };

    const handleDeleteCustomSection = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.filter(s => s.id !== id),
            sectionOrder: prev.sectionOrder.filter(key => key !== id)
        }));
    };

    const handleUpdateCustomSection = (id: string, field: keyof CustomSection, value: any) => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const handleMoveCustomSectionItem = (sectionId: string, index: number, direction: 'up' | 'down') => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s => {
                if (s.id === sectionId) {
                    const list = s.items;
                    const toIndex = direction === 'up' ? index - 1 : index + 1;
                    if (toIndex < 0 || toIndex >= list.length) return s;
                    return { ...s, items: moveItemInArray(list, index, toIndex) };
                }
                return s;
            })
        }));
    };

    const handleAddCustomSectionItem = (sectionId: string) => {
        const newItem: CustomSectionItem = {
            id: `custom-item-${Date.now()}`,
            title: 'New Title',
            subtitle: 'Subtitle',
            date: 'Date',
            points: ['New point']
        };
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s =>
                s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
            )
        }));
    };

    const handleDeleteCustomSectionItem = (sectionId: string, itemId: string) => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s =>
                s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
            )
        }));
    };

    const handleUpdateCustomSectionItem = (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s => {
                if (s.id === sectionId) {
                    const newItems = s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i);
                    return { ...s, items: newItems };
                }
                return s;
            })
        }));
    };

    const handleUpdateCustomItemPoint = (sectionId: string, itemId: string, pointIndex: number, value: string) => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s => {
                if (s.id === sectionId) {
                    const newItems = s.items.map(i => {
                        if (i.id === itemId) {
                            const newPoints = [...i.points];
                            newPoints[pointIndex] = value;
                            return { ...i, points: newPoints };
                        }
                        return i;
                    });
                    return { ...s, items: newItems };
                }
                return s;
            })
        }));
    };
    const handleAddCustomItemPoint = (sectionId: string, itemId: string) => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s => {
                if (s.id === sectionId) {
                    const newItems = s.items.map(i => {
                        if (i.id === itemId) {
                            return { ...i, points: [...i.points, 'New Point'] };
                        }
                        return i;
                    });
                    return { ...s, items: newItems };
                }
                return s;
            })
        }));
    };
    const handleDeleteCustomItemPoint = (sectionId: string, itemId: string, pointIndex: number) => {
        setResumeData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s => {
                if (s.id === sectionId) {
                    const newItems = s.items.map(i => {
                        if (i.id === itemId) {
                            const newPoints = i.points.filter((_, index) => index !== pointIndex);
                            return { ...i, points: newPoints };
                        }
                        return i;
                    });
                    return { ...s, items: newItems };
                }
                return s;
            })
        }));
    };


    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.removeItem('resumeData');
            setResumeData(initialResumeData);
        }
    };

    const handleDownloadPdf = () => {
        setIsGeneratingPdf(true);

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const data = resumeData;

        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 10; // Reduced margin
        const contentW = pageW - margin * 2;
        let currentY = margin;

        const fontMap = { 'Merriweather': 'times', 'Lato': 'helvetica', 'Raleway': 'helvetica', 'Roboto Slab': 'times' };
        const baseFont = fontMap[data.settings.fontFamily] || 'helvetica';
        const baseFontSize = parseFloat(data.settings.fontSize) || 10;
        const ptToMm = 0.352778;
        const lineSpacing = baseFontSize * ptToMm * 1.3; // Tighter line spacing

        const sectionTitles: { [key: string]: string } = {
            publications: 'Publications',
            internships: 'Internships',
            projects: 'Projects',
            competitions: 'Competition/Conference',
            awards: 'Awards and Achievements',
            skills: 'Skills and Expertise',
            responsibilities: 'Positions of Responsibility',
        };

        const checkPageBreak = (spaceNeeded: number) => {
            if (currentY + spaceNeeded > pageH - margin) {
                pdf.addPage();
                currentY = margin;
            }
        };

        const drawSectionTitle = (title: string) => {
            checkPageBreak(10);
            pdf.setFillColor(data.settings.accentColor);
            pdf.rect(margin, currentY, contentW, 6, 'F');
            pdf.setTextColor('#FFFFFF');
            pdf.setFont(baseFont, 'bold');
            pdf.setFontSize(9.5);
            pdf.text(sanitizeText(title).toUpperCase(), pageW / 2, currentY + 4, { align: 'center' });
            currentY += 8; // Reduced space after title
            pdf.setTextColor('#000000');
        };

        const drawListItemPoints = (points: string[]) => {
            pdf.setFont(baseFont, 'normal');
            pdf.setFontSize(baseFontSize);
            for (const point of points) {
                const cleanedPoint = `• ${stripAndSanitizeHtml(point)}`;
                const lines = pdf.splitTextToSize(cleanedPoint, contentW - 4);
                checkPageBreak(lines.length * lineSpacing + 1);
                pdf.text(lines, margin + 2, currentY);
                currentY += lines.length * lineSpacing;
            }
        }

        // --- PDF GENERATION ---

        // HEADER
        checkPageBreak(35);
        if (data.logoUrl) pdf.addImage(data.logoUrl, 'PNG', margin, currentY, 18, 18);
        if (data.profileUrl) pdf.addImage(data.profileUrl, 'PNG', pageW - margin - 22, currentY, 22, 22);

        pdf.setFont(baseFont, 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(data.settings.accentColor);
        pdf.text(sanitizeText(data.name), pageW / 2, currentY + 5, { align: 'center' });

        pdf.setFont(baseFont, 'normal');
        pdf.setFontSize(10.5);
        pdf.setTextColor('#333333');
        pdf.text(sanitizeText(data.title), pageW / 2, currentY + 11, { align: 'center' });
        pdf.setFontSize(9.5);
        pdf.text(sanitizeText(data.specialization), pageW / 2, currentY + 16, { align: 'center' });

        pdf.setFontSize(8.5);
        const contactInfoString = [data.contact.phone, data.contact.email, data.contact.github, data.contact.linkedin].filter(Boolean).map(sanitizeText).join('  •  ');
        pdf.text(contactInfoString, pageW / 2, currentY + 21, { align: 'center' });
        currentY += 26; // Reduced header height
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.4);
        pdf.line(margin, currentY, pageW - margin, currentY);
        currentY += 4; // Reduced space after header line

        // SECTIONS
        for (const sectionKey of data.sectionOrder) {
            switch (sectionKey) {
                case 'education':
                    if (data.education.length > 0) {
                        drawSectionTitle('Education');
                        const head = [['Year', 'Degree/Exam', 'Institute', 'CGPA/Marks']];
                        const body = data.education.map(e => [
                            sanitizeText(e.year),
                            sanitizeText(e.degree),
                            sanitizeText(e.institute),
                            sanitizeText(e.score)
                        ]);
                        (pdf as any).autoTable({
                            head, body,
                            startY: currentY,
                            theme: 'grid',
                            headStyles: { fillColor: data.settings.accentColor, textColor: '#FFFFFF', font: baseFont, fontStyle: 'bold' },
                            styles: { font: baseFont, fontSize: baseFontSize - 1.5, cellPadding: 1.5 }
                        });
                        currentY = (pdf as any).lastAutoTable.finalY + 3;
                    }
                    break;

                case 'publications':
                case 'internships':
                case 'projects':
                case 'competitions':
                case 'responsibilities':
                    const sectionData = data[sectionKey as keyof ResumeData] as any[];
                    if (sectionData && sectionData.length > 0) {
                        drawSectionTitle(sectionTitles[sectionKey]);
                        sectionData.forEach((item: any) => {
                            const itemTitle = sanitizeText(item.role || item.title);
                            const subtitle = sanitizeText(item.company ? `${item.company}, ${item.location}` : item.group || item.details);
                            const date = sanitizeText(item.duration || item.date);

                            checkPageBreak(12);
                            pdf.setFont(baseFont, 'bold');
                            pdf.setFontSize(baseFontSize + 0.5);

                            const titleText = `${itemTitle}${subtitle ? ` - ${subtitle}` : ''}`;
                            const titleLines = pdf.splitTextToSize(titleText, contentW - (date ? 25 : 0));

                            const dateWidth = pdf.getStringUnitWidth(date) * (baseFontSize) / pdf.internal.scaleFactor;
                            pdf.setFont(baseFont, 'normal');
                            pdf.setFontSize(baseFontSize);
                            pdf.text(date, pageW - margin, currentY, { align: 'right' });

                            pdf.setFont(baseFont, 'bold');
                            pdf.setFontSize(baseFontSize + 0.5);
                            pdf.text(titleLines, margin, currentY);

                            currentY += titleLines.length * lineSpacing;

                            if (item.points) drawListItemPoints(item.points);
                            currentY += 1.5; // Reduced space between items
                        });
                    }
                    break;

                case 'awards':
                    if (data.awards.length > 0) {
                        drawSectionTitle('Awards and Achievements');
                        drawListItemPoints(data.awards.map(a => a.point));
                        currentY += 1.5;
                    }
                    break;

                case 'skills':
                    if (data.skills.length > 0) {
                        drawSectionTitle('Skills and Expertise');
                        pdf.setFontSize(baseFontSize - 0.5);
                        data.skills.forEach(skill => {
                            checkPageBreak(lineSpacing);
                            pdf.setFont(baseFont, 'bold');
                            pdf.text(sanitizeText(skill.category), margin, currentY);
                            pdf.setFont(baseFont, 'normal');
                            pdf.text(sanitizeText(skill.list), margin + 40, currentY);
                            currentY += lineSpacing;
                        });
                        currentY += 1.5;
                    }
                    break;

                default: // Custom Sections
                    if (sectionKey.startsWith('custom-')) {
                        const customSection = data.customSections.find(s => s.id === sectionKey);
                        if (customSection && customSection.items.length > 0) {
                            drawSectionTitle(customSection.title);
                            customSection.items.forEach((item: any) => {
                                checkPageBreak(12);
                                const itemTitle = sanitizeText(item.title);
                                const subtitle = sanitizeText(item.subtitle);
                                const date = sanitizeText(item.date);

                                pdf.setFont(baseFont, 'bold');
                                pdf.setFontSize(baseFontSize + 0.5);

                                const titleText = `${itemTitle}${subtitle ? ` - ${subtitle}` : ''}`;
                                const titleLines = pdf.splitTextToSize(titleText, contentW - (date ? 25 : 0));

                                const dateWidth = pdf.getStringUnitWidth(date) * (baseFontSize) / pdf.internal.scaleFactor;
                                pdf.setFont(baseFont, 'normal');
                                pdf.setFontSize(baseFontSize);
                                pdf.text(date, pageW - margin, currentY, { align: 'right' });

                                pdf.setFont(baseFont, 'bold');
                                pdf.setFontSize(baseFontSize + 0.5);
                                pdf.text(titleLines, margin, currentY);

                                currentY += titleLines.length * lineSpacing;

                                if (item.points) drawListItemPoints(item.points);
                                currentY += 1.5;
                            });
                        }
                    }
            }
        }

        pdf.save(`${sanitizeText(data.name).replace(/—.*/, '').trim().replace(/\s/g, '_')}_Resume.pdf`);
        setIsGeneratingPdf(false);
    };

    const handlers = {
        updateState: handleUpdateState,
        updateContact: handleUpdateContact,
        updateImage: handleUpdateImage,
        updateSettings: handleUpdateSettings,
        updateListItem: handleUpdateListItem,
        addListItem: handleAddListItem,
        deleteListItem: handleDeleteListItem,
        moveSection: handleMoveSection,
        moveListItem: handleMoveListItem,
        updateListItemPoint: handleUpdateListItemPoint,
        addListItemPoint: handleAddListItemPoint,
        deleteListItemPoint: handleDeleteListItemPoint,
        addCustomSection: handleAddCustomSection,
        deleteCustomSection: handleDeleteCustomSection,
        updateCustomSection: handleUpdateCustomSection,
        moveCustomSectionItem: handleMoveCustomSectionItem,
        addCustomSectionItem: handleAddCustomSectionItem,
        deleteCustomSectionItem: handleDeleteCustomSectionItem,
        updateCustomSectionItem: handleUpdateCustomSectionItem,
        updateCustomItemPoint: handleUpdateCustomItemPoint,
        addCustomItemPoint: handleAddCustomItemPoint,
        deleteCustomItemPoint: handleDeleteCustomItemPoint
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-slate-100">
            <header className="flex items-center justify-between p-3 border-b bg-white/80 backdrop-blur-sm shadow-sm no-print z-20">
                <div className="flex items-center gap-3">
                    <img src={defaultLogoUrl} alt="BIT Sindri Logo" className="h-8 w-8 object-contain" />
                    <h1 className="text-xl font-bold text-slate-800">BIT Sindri CV Portal</h1>
                    <button onClick={() => setEditorVisible(!editorVisible)} title={editorVisible ? 'Collapse Editor' : 'Expand Editor'} className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition">
                        {editorVisible ? <LayoutSidebarLeftCollapse className="w-5 h-5" /> : <LayoutSidebarLeftExpand className="w-5 h-5" />}
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition">Reset</button>
                    <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 rounded-md transition disabled:bg-slate-400 disabled:cursor-wait">
                        {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
            </header>
            <div className="flex-1 flex overflow-hidden">
                <aside className={`no-print transition-all duration-300 ${editorVisible ? 'w-1/3 min-w-[450px]' : 'w-0 min-w-0'}`}>
                    <div className="h-full overflow-y-auto bg-white border-r editor-scroll">
                        {editorVisible && <Editor resumeData={resumeData} handlers={handlers} />}
                    </div>
                </aside>
                <main ref={mainRef} className="flex-1 flex justify-center items-start p-6 bg-slate-200 overflow-auto">
                    <div
                        ref={resumeWrapperRef}
                        style={{
                            height: `calc(297mm * ${scale})`,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top center',
                            transition: 'transform 0.3s ease-in-out, height 0.3s ease-in-out'
                        }}
                    >
                        <ResumeContent resumeData={resumeData} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;