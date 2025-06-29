import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ContactInfo, Education, Publication, Experience, Project, Competition, Award, Skill, Responsibility, CustomSection, ResumeSettings, CustomSectionItem } from '../types';
import { PlusCircleIcon, TrashIcon, ChevronDownIcon, SettingsIcon, ListOrderedIcon, ArrowUpIcon, ArrowDownIcon } from './icons';
import RichTextInput from './RichTextInput';

type Handlers = {
    updateState: (key: keyof ResumeData, value: any) => void;
    updateContact: (field: keyof ContactInfo, value: string) => void;
    updateImage: (field: 'logoUrl' | 'profileUrl', value: string) => void;
    updateSettings: (field: keyof ResumeSettings, value: any) => void;
    updateListItem: (section: keyof ResumeData, id: string, field: string, value: any) => void;
    updateListItemPoint: (section: keyof ResumeData, itemId: string, pointIndex: number, value: string) => void;
    addListItemPoint: (section: keyof ResumeData, itemId: string) => void;
    deleteListItemPoint: (section: keyof ResumeData, itemId: string, pointIndex: number) => void;
    addListItem: (section: keyof ResumeData) => void;
    deleteListItem: (section: keyof ResumeData, id: string) => void;
    moveSection: (index: number, direction: 'up' | 'down') => void;
    moveListItem: (section: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
    addCustomSection: () => void;
    deleteCustomSection: (id: string) => void;
    updateCustomSection: (id: string, field: keyof CustomSection, value: any) => void;
    moveCustomSectionItem: (sectionId: string, index: number, direction: 'up' | 'down') => void;
    addCustomSectionItem: (sectionId: string) => void;
    deleteCustomSectionItem: (sectionId: string, itemId: string) => void;
    updateCustomSectionItem: (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => void;
    updateCustomItemPoint: (sectionId: string, itemId: string, pointIndex: number, value: string) => void;
    addCustomItemPoint: (sectionId: string, itemId: string) => void;
    deleteCustomItemPoint: (sectionId: string, itemId: string, pointIndex: number) => void;
};
interface EditorProps { resumeData: ResumeData; handlers: Handlers; }

const ManagedInput = ({ initialValue, onSave, label, placeholder, type = 'text', as = 'input', rows = 3 }: {
    initialValue: string;
    onSave: (value: string) => void;
    label: string;
    placeholder?: string;
    type?: string;
    as?: 'input' | 'textarea';
    rows?: number;
}) => {
    const [value, setValue] = useState(initialValue);
    const isFocused = useRef(false);

    useEffect(() => {
        if (!isFocused.current) {
            setValue(initialValue);
        }
    }, [initialValue]);

    const handleFocus = () => { isFocused.current = true; };
    const handleBlur = () => {
        isFocused.current = false;
        if (value !== initialValue) { onSave(value); }
    };

    const commonProps = {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
        onFocus: handleFocus,
        onBlur: handleBlur,
        placeholder: placeholder || label,
        className: "w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition text-sm bg-white"
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            {as === 'textarea' ? <textarea {...commonProps} rows={rows} /> : <input type={type} {...commonProps} />}
        </div>
    );
};


const AccordionItem: React.FC<{ title: React.ReactNode; children: React.ReactNode; }> = ({ title, children }) => (
    <details className="border-b border-slate-200 details-open bg-white" open>
        <summary className="p-4 font-semibold text-slate-800 cursor-pointer flex justify-between items-center hover:bg-slate-50/80 transition group">
            <div className="flex items-center gap-3">{title}</div>
            <ChevronDownIcon className="w-5 h-5 transition-transform accordion-chevron text-slate-500" />
        </summary>
        <div className="p-4 bg-slate-50/50 border-t border-slate-200 space-y-4">{children}</div>
    </details>
);

const ImageInput = ({ label, imageUrl, onImageChange }: { label: string, imageUrl: string, onImageChange: (base64: string) => void }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { onImageChange(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                {imageUrl && <img src={imageUrl} alt="preview" className="w-16 h-16 object-contain border rounded-md p-1 bg-white" />}
                <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
            </div>
        </div>
    );
};

const AddButton: React.FC<{onClick: () => void, text: string}> = ({ onClick, text }) => (
     <button onClick={onClick} className="mt-2 w-full flex items-center justify-center gap-2 p-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors">
        <PlusCircleIcon className="w-5 h-5" /> {text}
    </button>
);

const ReorderableItemWrapper: React.FC<{
    children: React.ReactNode;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}> = ({ children, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => (
    <div className="p-4 border border-slate-200 rounded-lg bg-white relative space-y-4 shadow-sm">
        <div className="absolute top-3 right-12 flex gap-1 z-10">
            <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed transition">
                <ArrowUpIcon className="w-4 h-4" />
            </button>
            <button onClick={onMoveDown} disabled={isLast} className="p-0.5 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed transition">
                <ArrowDownIcon className="w-4 h-4" />
            </button>
        </div>
        <button onClick={onDelete} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors">
            <TrashIcon className="w-5 h-5" />
        </button>
        <div>{children}</div>
    </div>
);


function itemHasPoints(item: any): item is { points: string[] } {
    return item && typeof item === 'object' && 'points' in item && Array.isArray(item.points);
}

const Editor: React.FC<EditorProps> = ({ resumeData, handlers }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'design' | 'reorder'>('content');
    
    const renderStandardListSection = <T extends {id: string}>(
        title: string, 
        sectionKey: keyof ResumeData, 
        renderItem: (item: T) => React.ReactNode
    ) => {
        const items = resumeData[sectionKey] as unknown as T[];
        if (!Array.isArray(items)) return null;

        return (
            <div className="space-y-4">
                {items.map((item, index) => (
                    <ReorderableItemWrapper
                        key={item.id}
                        onDelete={() => handlers.deleteListItem(sectionKey, item.id)}
                        onMoveUp={() => handlers.moveListItem(sectionKey, index, 'up')}
                        onMoveDown={() => handlers.moveListItem(sectionKey, index, 'down')}
                        isFirst={index === 0}
                        isLast={index === items.length - 1}
                    >
                        {renderItem(item)}
                        {itemHasPoints(item) && (
                            <div className="space-y-2 pt-3 mt-3 border-t border-slate-200">
                                <label className="block text-sm font-medium text-slate-600">Key Points / Achievements</label>
                                {(item as any).points.map((point: string, pIdx: number) => (
                                    <div key={pIdx} className="flex items-start gap-2">
                                        <RichTextInput value={point} onChange={newHtml => handlers.updateListItemPoint(sectionKey, item.id, pIdx, newHtml)}/>
                                        <button onClick={() => handlers.deleteListItemPoint(sectionKey, item.id, pIdx)} className="text-red-500 p-1 rounded-full hover:bg-red-100 mt-2 flex-shrink-0"> <TrashIcon className="w-4 h-4"/> </button>
                                    </div>
                                ))}
                                <button onClick={() => handlers.addListItemPoint(sectionKey, item.id)} className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1 pt-1"> <PlusCircleIcon className="w-4 h-4" /> Add Point </button>
                            </div>
                        )}
                    </ReorderableItemWrapper>
                ))}
                <AddButton onClick={() => handlers.addListItem(sectionKey)} text={`Add ${title.slice(0, -1)}`} />
            </div>
        )
    };

    const sectionComponents: Record<string, React.ReactElement> = {
        education: <AccordionItem title="Education">{renderStandardListSection<Education>('Education', 'education', (item) => (
            <div className="grid grid-cols-2 gap-4">
                <ManagedInput label="Year" initialValue={item.year} onSave={val => handlers.updateListItem('education', item.id, 'year', val)} />
                <ManagedInput label="Degree/Exam" initialValue={item.degree} onSave={val => handlers.updateListItem('education', item.id, 'degree', val)} />
                <ManagedInput label="Institute" initialValue={item.institute} onSave={val => handlers.updateListItem('education', item.id, 'institute', val)} />
                <ManagedInput label="CGPA/Marks" initialValue={item.score} onSave={val => handlers.updateListItem('education', item.id, 'score', val)} />
            </div>
        ))}</AccordionItem>,
        publications: <AccordionItem title="Publications">{renderStandardListSection<Publication>('Publications', 'publications', (item) => (
            <div className="space-y-4">
                <ManagedInput label="Title" initialValue={item.title} onSave={val => handlers.updateListItem('publications', item.id, 'title', val)} />
                <div className="grid grid-cols-2 gap-4">
                    <ManagedInput label="Details" initialValue={item.details} onSave={val => handlers.updateListItem('publications', item.id, 'details', val)} placeholder="e.g. Conference - Location" />
                    <ManagedInput label="Date" initialValue={item.date} onSave={val => handlers.updateListItem('publications', item.id, 'date', val)} />
                </div>
            </div>
        ))}</AccordionItem>,
        internships: <AccordionItem title="Internships">{renderStandardListSection<Experience>('Internships', 'internships', (item) => (
            <div className="grid grid-cols-2 gap-4">
                <ManagedInput label="Role" initialValue={item.role} onSave={val => handlers.updateListItem('internships', item.id, 'role', val)} />
                <ManagedInput label="Company" initialValue={item.company} onSave={val => handlers.updateListItem('internships', item.id, 'company', val)} />
                <ManagedInput label="Location" initialValue={item.location} onSave={val => handlers.updateListItem('internships', item.id, 'location', val)} />
                <ManagedInput label="Duration" initialValue={item.duration} onSave={val => handlers.updateListItem('internships', item.id, 'duration', val)} />
            </div>
        ))}</AccordionItem>,
        projects: <AccordionItem title="Projects">{renderStandardListSection<Project>('Projects', 'projects', (item) => (
            <div className="space-y-4">
                <ManagedInput label="Title" initialValue={item.title} onSave={val => handlers.updateListItem('projects', item.id, 'title', val)} />
                <div className="grid grid-cols-2 gap-4">
                    <ManagedInput label="Details" initialValue={item.details} onSave={val => handlers.updateListItem('projects', item.id, 'details', val)} placeholder="e.g. Self Project"/>
                    <ManagedInput label="Date" initialValue={item.date} onSave={val => handlers.updateListItem('projects', item.id, 'date', val)} />
                </div>
            </div>
        ))}</AccordionItem>,
        competitions: <AccordionItem title="Competitions">{renderStandardListSection<Competition>('Competitions', 'competitions', (item) => (
            <div className="grid grid-cols-2 gap-4">
                <ManagedInput label="Title" initialValue={item.title} onSave={val => handlers.updateListItem('competitions', item.id, 'title', val)} />
                <ManagedInput label="Date" initialValue={item.date} onSave={val => handlers.updateListItem('competitions', item.id, 'date', val)} />
            </div>
        ))}</AccordionItem>,
        awards: <AccordionItem title="Awards">{renderStandardListSection<Award>('Awards', 'awards', (item) => (
            <RichTextInput value={item.point} onChange={newHtml => handlers.updateListItem('awards', item.id, 'point', newHtml)} />
        ))}</AccordionItem>,
        skills: <AccordionItem title="Skills">{renderStandardListSection<Skill>('Skills', 'skills', (item) => (
            <div className="space-y-4">
                <ManagedInput label="Category" initialValue={item.category} onSave={val => handlers.updateListItem('skills', item.id, 'category', val)} placeholder="e.g. Languages & Libraries:"/>
                <ManagedInput label="List" as="textarea" initialValue={item.list} onSave={val => handlers.updateListItem('skills', item.id, 'list', val)} placeholder="Comma, separated, skills" />
            </div>
        ))}</AccordionItem>,
        responsibilities: <AccordionItem title="Responsibilities">{renderStandardListSection<Responsibility>('Responsibilities', 'responsibilities', (item) => (
             <div className="grid grid-cols-2 gap-4">
                <ManagedInput label="Role" initialValue={item.role} onSave={val => handlers.updateListItem('responsibilities', item.id, 'role', val)} />
                <ManagedInput label="Group" initialValue={item.group} onSave={val => handlers.updateListItem('responsibilities', item.id, 'group', val)} />
                <ManagedInput label="Duration" initialValue={item.duration} onSave={val => handlers.updateListItem('responsibilities', item.id, 'duration', val)} />
             </div>
        ))}</AccordionItem>
    };

    const renderCustomSection = (section: CustomSection) => {
        const titleInput = <input type="text" value={section.title} onChange={e => handlers.updateCustomSection(section.id, 'title', e.target.value)} placeholder="e.g., Certifications" className="font-semibold text-slate-800 bg-transparent focus:ring-0 focus:outline-none w-full" />;
        return (
            <AccordionItem title={titleInput}>
                <div className="space-y-4">
                    {section.items.map((item, index) => (
                        <ReorderableItemWrapper
                            key={item.id}
                            onDelete={() => handlers.deleteCustomSectionItem(section.id, item.id)}
                            onMoveUp={() => handlers.moveCustomSectionItem(section.id, index, 'up')}
                            onMoveDown={() => handlers.moveCustomSectionItem(section.id, index, 'down')}
                            isFirst={index === 0}
                            isLast={index === section.items.length - 1}
                        >
                           <div className="grid grid-cols-2 gap-4">
                               <ManagedInput label="Title" initialValue={item.title} onSave={val => handlers.updateCustomSectionItem(section.id, item.id, 'title', val)} />
                               <ManagedInput label="Subtitle" initialValue={item.subtitle} onSave={val => handlers.updateCustomSectionItem(section.id, item.id, 'subtitle', val)} placeholder="e.g. Issuing Body" />
                               <ManagedInput label="Date" initialValue={item.date} onSave={val => handlers.updateCustomSectionItem(section.id, item.id, 'date', val)} />
                           </div>
                            <div className="space-y-2 pt-3 mt-3 border-t border-slate-200">
                                <label className="block text-sm font-medium text-slate-600">Key Points</label>
                                {item.points.map((point, pIdx) => (
                                    <div key={pIdx} className="flex items-start gap-2">
                                        <RichTextInput value={point} onChange={newHtml => handlers.updateCustomItemPoint(section.id, item.id, pIdx, newHtml)} />
                                        <button onClick={() => handlers.deleteCustomItemPoint(section.id, item.id, pIdx)} className="text-red-500 p-1 rounded-full hover:bg-red-100 mt-2 flex-shrink-0"> <TrashIcon className="w-4 h-4"/> </button>
                                    </div>
                                ))}
                                <button onClick={() => handlers.addCustomItemPoint(section.id, item.id)} className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1 pt-1"> <PlusCircleIcon className="w-4 h-4" /> Add Point </button>
                            </div>
                        </ReorderableItemWrapper>
                   ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                    <AddButton onClick={() => handlers.addCustomSectionItem(section.id)} text="Add Item" />
                    <button onClick={() => handlers.deleteCustomSection(section.id)} className="text-sm font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"><TrashIcon className="w-4 h-4"/> Delete Section</button>
                </div>
            </AccordionItem>
        );
    }

    const renderContentEditor = () => (
        <div className="divide-y divide-slate-200">
            <AccordionItem title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ManagedInput label="Full Name & Roll" initialValue={resumeData.name} onSave={val => handlers.updateState('name', val)} />
                    <ManagedInput label="Title" initialValue={resumeData.title} onSave={val => handlers.updateState('title', val)} placeholder="e.g. M.Tech Dual 5Y" />
                </div>
                <ManagedInput label="Specialization" initialValue={resumeData.specialization} onSave={val => handlers.updateState('specialization', val)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ManagedInput label="Phone" initialValue={resumeData.contact.phone} onSave={val => handlers.updateContact('phone', val)} />
                    <ManagedInput label="Email" initialValue={resumeData.contact.email} onSave={val => handlers.updateContact('email', val)} />
                    <ManagedInput label="GitHub Handle" initialValue={resumeData.contact.github} onSave={val => handlers.updateContact('github', val)} />
                    <ManagedInput label="LinkedIn Handle" initialValue={resumeData.contact.linkedin} onSave={val => handlers.updateContact('linkedin', val)} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageInput label="Logo Image" imageUrl={resumeData.logoUrl} onImageChange={val => handlers.updateImage('logoUrl', val)} />
                    <ImageInput label="Profile Image" imageUrl={resumeData.profileUrl} onImageChange={val => handlers.updateImage('profileUrl', val)} />
                </div>
            </AccordionItem>
            
            {resumeData.sectionOrder.map(sectionKey => {
                if (sectionKey.startsWith('custom-')) {
                    const section = resumeData.customSections.find(s => s.id === sectionKey);
                    return section ? <div key={sectionKey}>{renderCustomSection(section)}</div> : null;
                }
                const component = sectionComponents[sectionKey];
                return component ? <div key={sectionKey}>{component}</div> : null;
            })}

            <div className="p-4 bg-white">
                 <AddButton onClick={handlers.addCustomSection} text="Add Custom Section" />
            </div>
        </div>
    );

    const renderDesignEditor = () => {
        const { settings } = resumeData;
        const fonts = ['Merriweather', 'Lato', 'Raleway', 'Roboto Slab'];
        return (
            <div className="p-4 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Font Family</label>
                    <select value={settings.fontFamily} onChange={e => handlers.updateSettings('fontFamily', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white">
                        {fonts.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Font Size (pt)</label>
                    <div className="flex items-center gap-2">
                         <input type="range" min="8" max="14" step="0.5" value={settings.fontSize} onChange={e => handlers.updateSettings('fontSize', e.target.value)} className="w-full" />
                         <span className="font-semibold text-slate-600 w-12 text-center">{settings.fontSize}pt</span>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Accent Color</label>
                    <div className="flex items-center gap-2">
                        <input type="color" value={settings.accentColor} onChange={e => handlers.updateSettings('accentColor', e.target.value)} className="w-10 h-10 p-1 border rounded-md" />
                        <input type="text" value={settings.accentColor} onChange={e => handlers.updateSettings('accentColor', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white" />
                    </div>
                </div>
            </div>
        )
    }
    
    const renderReorderEditor = () => {
        const getSectionTitle = (key: string): string => {
            if (key.startsWith('custom-')) {
                return resumeData.customSections.find(s => s.id === key)?.title || "Custom Section";
            }
            const component = sectionComponents[key];
            if (component?.props && typeof (component.props as any).title === 'string') {
                return (component.props as any).title;
            }
            return key.charAt(0).toUpperCase() + key.slice(1);
        }

        return (
            <div className="p-4 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Reorder Sections</h3>
                <p className="text-sm text-slate-500 mb-4">
                    Drag and drop to reorder the sections of your resume.
                </p>
                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    {resumeData.sectionOrder.map((key, index) => (
                        <div key={key} className="p-3 bg-white border-b flex items-center justify-between group">
                            <span className="font-medium text-slate-700">{getSectionTitle(key)}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handlers.moveSection(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                                    title="Move Up"
                                >
                                    <ArrowUpIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handlers.moveSection(index, 'down')}
                                    disabled={index === resumeData.sectionOrder.length - 1}
                                    className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                                    title="Move Down"
                                >
                                    <ArrowDownIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    
    return (
        <div>
            <div className="border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                <nav className="flex">
                    <button onClick={() => setActiveTab('content')} className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'content' ? 'text-slate-800 border-slate-700' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}>
                        Content
                    </button>
                    <button onClick={() => setActiveTab('design')} className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'design' ? 'text-slate-800 border-slate-700' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}>
                        <SettingsIcon className="w-4 h-4" /> Design
                    </button>
                     <button onClick={() => setActiveTab('reorder')} className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'reorder' ? 'text-slate-800 border-slate-700' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}>
                        <ListOrderedIcon className="w-4 h-4" /> Reorder
                    </button>
                </nav>
            </div>
            {activeTab === 'content' ? renderContentEditor() : activeTab === 'design' ? renderDesignEditor() : renderReorderEditor()}
        </div>
    );
};

export default Editor;