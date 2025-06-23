
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CV } from '@/types/cv';

export const generatePDF = async (cv: CV, language: 'en' | 'ko') => {
  try {
    console.log('Starting PDF generation for CV:', cv.name);
    
    // Create a temporary container for the CV content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20mm';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Generate HTML content for PDF
    const htmlContent = generateCVHTML(cv, language);
    tempContainer.innerHTML = htmlContent;
    document.body.appendChild(tempContainer);
    
    // Generate canvas from HTML
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    // Remove temporary container
    document.body.removeChild(tempContainer);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download the PDF
    const fileName = `${cv.name.replace(/[^a-z0-9]/gi, '_')}_CV.pdf`;
    pdf.save(fileName);
    console.log('PDF generated successfully:', fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

const generateCVHTML = (cv: CV, language: 'en' | 'ko') => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
  };

  const formatText = (text: string) => {
    return text.replace(/\n/g, '<br>');
  };

  const labels = language === 'ko' ? {
    email: '이메일',
    phone: '전화번호',
    address: '주소',
    country: '국가',
    dob: '생년월일',
    visa: '비자',
    careerSummary: '경력 요약',
    skills: '기술',
    workExperience: '경력',
    education: '학력',
    languages: '언어',
    selfIntroduction: '자기소개',
    portfolioLinks: '포트폴리오 & 링크',
    present: '현재',
    score: '점수'
  } : {
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    country: 'Country',
    dob: 'Date of Birth',
    visa: 'Visa',
    careerSummary: 'Career Summary',
    skills: 'Skills',
    workExperience: 'Work Experience',
    education: 'Education',
    languages: 'Languages',
    selfIntroduction: 'Self Introduction',
    portfolioLinks: 'Portfolio & Links',
    present: 'Present',
    score: 'Score'
  };

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: #1e293b;">
          ${cv.personalInfo.fullNameEng || 'Full Name'}
          ${cv.personalInfo.fullNameKor ? `<span style="font-size: 20px; color: #64748b; margin-left: 10px;">(${cv.personalInfo.fullNameKor})</span>` : ''}
        </h1>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; color: #475569;">
          ${cv.personalInfo.email ? `<div><strong>${labels.email}:</strong> ${cv.personalInfo.email}</div>` : ''}
          ${cv.personalInfo.phone ? `<div><strong>${labels.phone}:</strong> ${cv.personalInfo.phone}</div>` : ''}
          ${cv.personalInfo.address ? `<div><strong>${labels.address}:</strong> ${cv.personalInfo.address}</div>` : ''}
          ${cv.personalInfo.country ? `<div><strong>${labels.country}:</strong> ${cv.personalInfo.country}</div>` : ''}
          ${cv.personalInfo.dob ? `<div><strong>${labels.dob}:</strong> ${cv.personalInfo.dob}</div>` : ''}
          ${cv.personalInfo.visaType ? `<div><strong>${labels.visa}:</strong> ${cv.personalInfo.visaType}${cv.personalInfo.visaOther ? ` - ${cv.personalInfo.visaOther}` : ''}</div>` : ''}
        </div>
      </div>

      ${cv.summary ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 15px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${labels.careerSummary}</h2>
          <div style="color: #475569;">${formatText(cv.summary)}</div>
        </div>
      ` : ''}

      ${cv.skills.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 15px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${labels.skills}</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${cv.skills.map(skill => `<span style="background-color: #dbeafe; color: #1d4ed8; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${cv.experiences.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${labels.workExperience}</h2>
          ${cv.experiences.map(exp => `
            <div style="border-left: 4px solid #bfdbfe; padding-left: 20px; margin-bottom: 25px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                  <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: #1e293b;">${exp.title}</h3>
                  <p style="color: #1d4ed8; font-weight: 500; margin: 5px 0 0 0;">${exp.company}</p>
                </div>
                <div style="font-size: 14px; color: #64748b;">
                  ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : labels.present}
                </div>
              </div>
              ${exp.description ? `<div style="color: #475569;">${formatText(exp.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${cv.education.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${labels.education}</h2>
          ${cv.education.map(edu => `
            <div style="border-left: 4px solid #bbf7d0; padding-left: 20px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                  <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: #1e293b;">${edu.degree}</h3>
                  <p style="color: #059669; font-weight: 500; margin: 5px 0 0 0;">${edu.school}</p>
                </div>
                <div style="font-size: 14px; color: #64748b;">
                  ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                </div>
              </div>
              ${edu.notes ? `<div style="color: #475569;">${formatText(edu.notes)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${cv.languages.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">${labels.languages}</h2>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            ${cv.languages.map(lang => `
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center;">
                <h3 style="font-weight: 600; margin: 0; color: #1e293b;">${lang.language} (${lang.proficiency})</h3>
                ${lang.score ? `<p style="font-size: 14px; color: #64748b; margin: 5px 0 0 0;">${labels.score}: ${lang.score}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
};
