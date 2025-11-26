function extractKeyPoints(note) {
  return {
    presentingComplaint: findSection(note, "Presenting Complaint"),
    hpi: findSection(note, "HPI"),
    assessment: findSection(note, "Assessment"),
    plan: findSection(note, "Plan")
  };
}

function findSection(text, title) {
  const regex = new RegExp(`${title}:([\\s\\S]*?)(?=\\n[A-Z][A-Za-z ]+:|$)`);
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

export default extractKeyPoints;