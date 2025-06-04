import React, { useState } from 'react';
import { X,Menu,Download, Upload, Share, Bot } from "lucide-react";
const Temp6 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [resumeData, setResumeData] = useState({
    name: 'Your Name',
    contact: {
      phone: 'xxx-xxx-xxxx',
      email: 'you@gmail.com'
    },
    sections: [
      {
        id: 1,
        title: 'SKILLS',
        content: [
          { id: 1, subtitle: 'BACKEND DEVELOPMENT', items: 'Java • Python • Spring • Django • NodeJS' },
          { id: 2, subtitle: 'DATA PIPELINES', items: 'Amazon RedShift • Amazon S3 • S3' },
          { id: 3, subtitle: 'MISCELLANEOUS', items: 'Amazon Q • Recommendations • Collaborative filtering • SQL' },
          { id: 4, subtitle: 'FRONT END DEVELOPMENT', items: 'ReactJS • Redux • JavaScript • Bootstrap •' },
          { id: 5, subtitle: 'SOFT SKILLS', items: 'Team player • Data-to-action • Deliver results' }
        ]
      },
      {
        id: 2,
        title: 'AMAZON',
        content: [
          { id: 1, subtitle: 'SDE, Spring, Python, AWS, Machine Learning, Recommendations', items: '' },
          { id: 2, subtitle: 'Amazon Prime | Full Time | Vancouver | May 2022 - Current', items: '' },
          { 
            id: 3, 
            subtitle: '', 
            items: "• Used Natural Language Processing technology to recommend Amazon Choice items related to customer's incomplete searches\n• Developed architecture for Amazon Personalize Choice recommendations for Prime members\n• Bulk client pipeline with Amazon RedShift and Amazon EFS to run offline data, event sourcing/ETL for Amazon Choice event-driven and streaming capacity loads\n• Personalized recommendations with topic filtering\n• Delivered increase of 41% in customer engagement in top topics and monetize\n• Scaled up customer's hit-conversion rate by 20% on new releases\n• Near real-time data transfer from mobile app in high traffic frontend session"
          }
        ]
      },
      {
        id: 4,
        title: 'FINTECH CORPORATION',
        content: [
          { 
            id: 1, 
            subtitle: 'SDE Intern | Jan 2019 - Apr 2019 | Chicago, IL', 
            items: '• Implemented API for custom order management and execution\n• Leveraged pre-trained region classification to identify countries and Americas'
          }
        ]
      },
      {
        id: 5,
        title: 'EDUCATION',
        content: [
          { 
            id: 1, 
            subtitle: 'UNIVERSITY OF ILLINOIS URBANA CHAMPAIGN (UIUC)', 
            items: 'B.S., Mechanical Engineering\nMay 2020\nGPA: 3.74/4'
          },
          { 
            id: 2, 
            subtitle: 'INDIAN INSTITUTE OF TECHNOLOGY DELHI (IITD)', 
            items: 'M.S., Computer Science\nGPA: 8.98/10'
          }
        ]
      },
      {
        id: 6,
        title: 'HONORS & AWARDS',
        content: [
          { 
            id: 1, 
            subtitle: 'CODEGA SCHOLARSHIP', 
            items: 'Top 35 exchange students from India | 2019 - 2020'
          },
          { 
            id: 2, 
            subtitle: 'DIRECTOR\'S MERIT AWARD', 
            items: 'IITD | 2019'
          },
          { 
            id: 3, 
            subtitle: 'K. VAIDYANATHAN AWARD', 
            items: 'Top rank in the UG cohort of the academics | V (2019) | 2019 | 2020' 
          }
        ]
      },
      {
        id: 7,
        title: 'PROJECTS',
        content: [
          { 
            id: 1, 
            subtitle: 'PERSONAL FINANCE TRACKER', 
            items: '• Built a full-stack application using React, Node.js, and MongoDB\n• Implemented user authentication and expense tracking features\n• Deployed on AWS using Docker containers'
          },
          { 
            id: 2, 
            subtitle: 'MACHINE LEARNING PIPELINE', 
            items: '• Developed a data processing pipeline for sentiment analysis\n• Used Python, TensorFlow, and AWS SageMaker\n• Achieved 92% accuracy on the test dataset'
          }
        ]
      }
    ]
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

  // Handle name change
  const handleNameChange = (e) => {
    setResumeData({
      ...resumeData,
      name: e.target.value
    });
  };

  // Handle contact info changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      contact: {
        ...resumeData.contact,
        [name]: value
      }
    });
  };

  // Edit section title
  const handleEditSection = (sectionId) => {
    setEditingSection(sectionId);
  };

  const handleSaveSection = (e, sectionId) => {
    e.preventDefault();
    const updatedSections = resumeData.sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, title: e.target.sectionTitle.value };
      }
      return section;
    });
    setResumeData({ ...resumeData, sections: updatedSections });
    setEditingSection(null);
  };

  // Delete section
  const handleDeleteSection = (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      const updatedSections = resumeData.sections.filter(section => section.id !== sectionId);
      setResumeData({ ...resumeData, sections: updatedSections });
    }
  };

  // Add new section
  const handleAddSection = (e) => {
    e.preventDefault();
    const newId = Math.max(...resumeData.sections.map(s => s.id), 0) + 1;
    const newSection = {
      id: newId,
      title: newSectionTitle,
      content: []
    };
    setResumeData({
      ...resumeData,
      sections: [...resumeData.sections, newSection]
    });
    setNewSectionTitle('');
    setShowAddSection(false);
  };

  // Edit content item
  const handleEditItem = (sectionId, itemId) => {
    setEditingItem({ sectionId, itemId });
  };

  const handleSaveItem = (e, sectionId, itemId) => {
    e.preventDefault();
    const updatedSections = resumeData.sections.map(section => {
      if (section.id === sectionId) {
        const updatedContent = section.content.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              subtitle: e.target.subtitle.value,
              items: e.target.items.value
            };
          }
          return item;
        });
        return { ...section, content: updatedContent };
      }
      return section;
    });
    setResumeData({ ...resumeData, sections: updatedSections });
    setEditingItem(null);
  };

  // Delete content item
  const handleDeleteItem = (sectionId, itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedSections = resumeData.sections.map(section => {
        if (section.id === sectionId) {
          const updatedContent = section.content.filter(item => item.id !== itemId);
          return { ...section, content: updatedContent };
        }
        return section;
      });
      setResumeData({ ...resumeData, sections: updatedSections });
    }
  };

  // Add new content item
  const handleAddItem = (sectionId) => {
    const section = resumeData.sections.find(s => s.id === sectionId);
    const newItemId = section.content.length > 0 
      ? Math.max(...section.content.map(i => i.id), 0) + 1 
      : 1;
    
    const updatedSections = resumeData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          content: [
            ...section.content,
            { id: newItemId, subtitle: 'New Item', items: 'Description' }
          ]
        };
      }
      return section;
    });
    
    setResumeData({ ...resumeData, sections: updatedSections });
    // Automatically set to edit mode for the new item
    setEditingItem({ sectionId, itemId: newItemId });
  };

  // Print button functionality
  const handleDownload= () => {
    window.print();
  };

  // Calculate the midpoint index for sections
  const midpoint = Math.ceil(resumeData.sections.length / 2);
  const leftSections = resumeData.sections.slice(0, midpoint);
  const rightSections = resumeData.sections.slice(midpoint);

  const handleShare = () => {
    const shareText = "Check out my resume!";
    const resumeUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + resumeUrl)}`;
    const emailUrl = `mailto:?subject=My Resume&body=${encodeURIComponent(shareText + " " + resumeUrl)}`;
    window.open(whatsappUrl, "_blank");
    window.open(emailUrl, "_blank");
  };

  const handleAIButtonClick = () => {
    setIsLoadingAI(true);
    setTimeout(() => {
      setIsLoadingAI(false);
      alert("AI enhancement completed!");
    }, 2000);
  };
  return (
    <div className="flex flex-col items-center">

<div className="flex w-full">
       {isLoadingAI && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 text-black text-2xl font-bold z-50">
          Enhancing AI...
        </div>
      )}

 {/* Mobile Menu Button */}
 <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2  rounded "
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar (Hidden on Mobile, Shows as a Menu) */}
      <div
        className={`w-64 bg-gray-900 text-white p-4 min-h-screen fixed top-0 left-0 transition-transform duration-300 ${
          menuOpen ? "translate-x-0 " : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex md:flex-col gap-4  overflow-y-auto z-40 `}
      >
       
        <button className="bg-green-500 p-2 rounded flex items-center gap-2 w-full" onClick={handleAIButtonClick}>
          <Bot size={18} /> AI
        </button>
        <button className="bg-orange-500 p-2 rounded flex items-center gap-2 w-full" onClick={handleDownload}>
          <Download size={18} /> Download
        </button>
        <button className="bg-gray-700 p-2 rounded flex items-center gap-2 w-full" onClick={handleShare}>
          <Share size={18} /> Share
        </button>

        <label htmlFor="uploadResume" className="bg-blue-700 p-2 rounded flex items-center gap-2 cursor-pointer">
          <Upload size={18} /> Upload Resume
        </label>
        <input id="uploadResume" type="file" className="hidden" />
      </div>
    <div/> 

      {/* A4 Container */}
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg print:shadow-none" 
           style={{
             width: '210mm',
             minHeight: '297mm',
             padding: '10mm',
             backgroundColor: 'white',
             boxSizing: 'border-box'
           }}>
        {/* Header with Name and Contact Information */}
        <div className="flex flex-col items-center mb-6">
          {/* Name centered at the top */}
          <input
            className="text-3xl font-bold border-b border-gray-300 px-2 py-1 text-center focus:outline-none focus:border-green-500 mb-2 w-full print:border-none"
            value={resumeData.name}
            onChange={handleNameChange}
          />
          
          {/* Contact information */}
          <div className="flex flex-row items-center space-x-4">
            <input
              className="border-b border-gray-300 px-2 py-1 text-center focus:outline-none focus:border-green-500 print:border-none"
              value={resumeData.contact.phone}
              name="phone"
              onChange={handleContactChange}
            />
            <input
              className="border-b border-gray-300 px-2 py-1 text-center focus:outline-none focus:border-green-500 print:border-none"
              value={resumeData.contact.email}
              name="email"
              onChange={handleContactChange}
            />
          </div>
        </div>

        {/* Main Content - Two Column Layout with fixed layout for print */}
        <div className="flex flex-row print:flex-row">
          {/* Left Column (2/3) */}
          <div className="w-2/3 p-2">
            {leftSections.map((section) => (
              <div key={section.id} className="mb-6">
                {/* Section Title with nearby buttons */}
                {editingSection === section.id ? (
                  <form onSubmit={(e) => handleSaveSection(e, section.id)} className="mb-2 print:hidden">
                    <div className="flex">
                      <input
                        name="sectionTitle"
                        defaultValue={section.title}
                        className="border border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-green-500"
                      />
                      <button type="submit" className="bg-green-500 text-white px-2 py-1 ml-2">
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                    <h2 className="font-bold text-lg mr-2">{section.title}</h2>
                    <div className="flex space-x-1 ml-auto print:hidden">
                      <button 
                        onClick={() => handleEditSection(section.id)}
                        className="text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-1.5 py-0.5 rounded"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => handleAddItem(section.id)}
                        className="text-xs text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 px-1.5 py-0.5 rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Section Content */}
                {section.content.map((item) => (
                  <div key={item.id} className="mb-3">
                    {editingItem && editingItem.sectionId === section.id && editingItem.itemId === item.id ? (
                      <form onSubmit={(e) => handleSaveItem(e, section.id, item.id)} className="space-y-2 print:hidden">
                        <input
                          name="subtitle"
                          defaultValue={item.subtitle}
                          className="border border-gray-300 px-2 py-1 w-full font-medium focus:outline-none focus:border-green-500"
                          placeholder="Subtitle"
                        />
                        <textarea
                          name="items"
                          defaultValue={item.items}
                          rows="4"
                          className="border border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-green-500"
                          placeholder="Content items"
                        />
                        <div className="flex space-x-2">
                          <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                            Save
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingItem(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        {item.subtitle && (
                          <div className="font-medium">{item.subtitle}</div>
                        )}
                        <div className="whitespace-pre-line text-sm">{item.items}</div>
                        <div className="flex space-x-1 mt-1 print:hidden">
                          <button 
                            onClick={() => handleEditItem(section.id, item.id)}
                            className="text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1 py-0.5 rounded"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(section.id, item.id)}
                            className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-1 py-0.5 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {section.content.length === 0 && (
                  <div className="text-gray-400 text-sm italic print:hidden">
                    No items yet. Click 'Add' to add content.
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column (1/3) */}
          <div className="w-1/3 p-2">
            {rightSections.map((section) => (
              <div key={section.id} className="mb-6">
                {/* Section Title with nearby buttons */}
                {editingSection === section.id ? (
                  <form onSubmit={(e) => handleSaveSection(e, section.id)} className="mb-2 print:hidden">
                    <div className="flex">
                      <input
                        name="sectionTitle"
                        defaultValue={section.title}
                        className="border border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-green-500"
                      />
                      <button type="submit" className="bg-green-500 text-white px-2 py-1 ml-2">
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                    <h2 className="font-bold text-lg mr-2">{section.title}</h2>
                    <div className="flex space-x-1 ml-auto print:hidden">
                      <button 
                        onClick={() => handleEditSection(section.id)}
                        className="text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-1.5 py-0.5 rounded"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => handleAddItem(section.id)}
                        className="text-xs text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 px-1.5 py-0.5 rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Section Content */}
                {section.content.map((item) => (
                  <div key={item.id} className="mb-3">
                    {editingItem && editingItem.sectionId === section.id && editingItem.itemId === item.id ? (
                      <form onSubmit={(e) => handleSaveItem(e, section.id, item.id)} className="space-y-2 print:hidden">
                        <input
                          name="subtitle"
                          defaultValue={item.subtitle}
                          className="border border-gray-300 px-2 py-1 w-full font-medium focus:outline-none focus:border-green-500"
                          placeholder="Subtitle"
                        />
                        <textarea
                          name="items"
                          defaultValue={item.items}
                          rows="4"
                          className="border border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-green-500"
                          placeholder="Content items"
                        />
                        <div className="flex space-x-2">
                          <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                            Save
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingItem(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        {item.subtitle && (
                          <div className="font-medium">{item.subtitle}</div>
                        )}
                        <div className="whitespace-pre-line text-sm">{item.items}</div>
                        <div className="flex space-x-1 mt-1 print:hidden">
                          <button 
                            onClick={() => handleEditItem(section.id, item.id)}
                            className="text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1 py-0.5 rounded"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(section.id, item.id)}
                            className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-1 py-0.5 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {section.content.length === 0 && (
                  <div className="text-gray-400 text-sm italic print:hidden">
                    No items yet. Click 'Add' to add content.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Section - Hidden when printing */}
        <div className="print:hidden">
          {showAddSection ? (
            <form onSubmit={handleAddSection} className="mt-4 border-t border-gray-300 pt-4">
              <div className="flex flex-col sm:flex-row">
                <input
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Section Title"
                  className="border border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-green-500 mb-2 sm:mb-0"
                />
                <div className="flex space-x-2 sm:ml-2">
                  <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
                    Add
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddSection(false)}
                    className="bg-gray-500 text-white px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowAddSection(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New Section
            </button>
          )}
        </div>
      </div>
     </div>
      {/* Add print specific CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:border-none {
              border: none !important;
            }
            .print\\:flex-row {
              flex-direction: row !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default Temp6;