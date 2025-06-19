
import DEFAULT from "../assets/file/DEFAULT.png"
import DOCX from "../assets/file/DOCX.png"
import PDF from "../assets/file/PDF.png"
import PPTX from "../assets/file/PPTX.png"
import TXT from "../assets/file/TXT.png"


export const imgReturn = (name)=>{

  switch (name) {
    case 'PDF':
      return PDF
    case 'DOCX':
      return DOCX
    case 'PPTX':
      return PPTX
    case 'TXT':
      return TXT
    default:
      return DEFAULT
  }
}