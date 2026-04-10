import { jsPDF } from "jspdf";
import "jspdf-autotable";

/**
 * Utility to generate PDF reports for the Church System
 */
export const generateFinancePDF = (data, title = "Reporte Financiero") => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // var(--text-primary) equivalent
  doc.text("Sistema de Gestión Iglesia", 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139); // var(--text-secondary)
  doc.text(title, 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 40);

  // Summary logic
  const totalIngre = data.reduce((acc, item) => item.transaction_type === 'ingreso' ? acc + parseFloat(item.amount) : acc, 0);
  const totalEgre = data.reduce((acc, item) => item.transaction_type === 'egreso' ? acc + parseFloat(item.amount) : acc, 0);
  
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(`Resumen del Periodo:`, 14, 52);
  doc.text(`Total Ingresos: $${totalIngre.toLocaleString()}`, 14, 60);
  doc.text(`Total Egresos: $${totalEgre.toLocaleString()}`, 14, 68);
  doc.text(`Balance Neto: $${(totalIngre - totalEgre).toLocaleString()}`, 14, 76);

  // Table
  const tableColumn = ["Fecha", "Tipo", "Categoría", "Descripción", "Monto"];
  const tableRows = data.map(item => [
    new Date(item.transaction_date).toLocaleDateString(),
    item.transaction_type.toUpperCase(),
    item.category,
    item.description || "N/A",
    `$${parseFloat(item.amount).toLocaleString()}`
  ]);

  doc.autoTable({
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }, // var(--accent-primary)
  });

  doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${Date.now()}.pdf`);
};

export const generateStatsPDF = (stats) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Reporte de Estadísticas Globales", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Miembros Activos: ${stats.members}`, 14, 40);
    doc.text(`Grupos Bíblicos: ${stats.groups}`, 14, 50);
    doc.text(`Sedes: ${stats.locations}`, 14, 60);
    doc.text(`Balance Financiero (30 días): $${stats.monthlyFinances.balance}`, 14, 70);
    
    doc.save(`estadisticas_globales_${Date.now()}.pdf`);
};
