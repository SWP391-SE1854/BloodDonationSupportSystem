export const permanentDisqualifications = [
  { id: 'hepatitis', label: 'Viêm gan B, viêm gan C', autoReject: true },
  { id: 'hiv', label: 'HIV/AIDS', autoReject: true },
  { id: 'syphilis', label: 'Giang mai', autoReject: true },
  { id: 'cardiovascular', label: 'Bệnh tim mạch nghiêm trọng (suy tim, nhồi máu cơ tim...)', autoReject: true },
  { id: 'cancer', label: 'Ung thư (dù đã chữa khỏi)', autoReject: true },
  { id: 'blood_malignancy', label: 'Bệnh máu ác tính (như bạch cầu, lymphoma)', autoReject: true },
  { id: 'neurological', label: 'Bệnh lý thần kinh nặng (động kinh, co giật, tâm thần phân liệt...)', autoReject: true },
  { id: 'diabetes', label: 'Tiểu đường phụ thuộc insulin', autoReject: true },
  { id: 'addiction', label: 'Nghiện ma túy, rượu nặng', autoReject: true },
  { id: 'unsafe_sex', label: 'Có quan hệ tình dục không an toàn, nhiều bạn tình, mại dâm...', autoReject: true },
];

export const temporaryDisqualifications = [
  { id: 'flu', label: 'Cúm, cảm sốt, viêm họng, viêm phế quản', autoReject: false },
  { id: 'dengue', label: 'Sốt xuất huyết', autoReject: false },
  { id: 'malaria', label: 'Sốt rét', autoReject: false },
  { id: 'surgery', label: 'Phẫu thuật hoặc tiểu phẫu', autoReject: false },
  { id: 'covid', label: 'Nhiễm COVID-19', autoReject: false },
  { id: 'vaccine', label: 'Tiêm vaccine', autoReject: false },
  { id: 'pregnancy', label: 'Mang thai và sau sinh', autoReject: false },
  { id: 'menstruation', label: 'Kinh nguyệt quá nhiều, mất máu nặng', autoReject: false },
  { id: 'antibiotics', label: 'Dùng kháng sinh hoặc điều trị bệnh lý khác', autoReject: false },
];

export const otherConsiderations = [
  'Người có huyết áp cao không kiểm soát',
  'Thiếu máu',
  'Cân nặng dưới 45kg',
]; 