export const permanentDisqualifications = [
  { id: 'hepatitis', label: 'Viêm gan B, viêm gan C' },
  { id: 'hiv', label: 'HIV/AIDS' },
  { id: 'syphilis', label: 'Giang mai' },
  { id: 'cardiovascular', label: 'Bệnh tim mạch nghiêm trọng (suy tim, nhồi máu cơ tim...)' },
  { id: 'cancer', label: 'Ung thư (dù đã chữa khỏi)' },
  { id: 'blood_malignancy', label: 'Bệnh máu ác tính (như bạch cầu, lymphoma)' },
  { id: 'neurological', label: 'Bệnh lý thần kinh nặng (động kinh, co giật, tâm thần phân liệt...)' },
  { id: 'diabetes', label: 'Tiểu đường phụ thuộc insulin' },
  { id: 'addiction', label: 'Nghiện ma túy, rượu nặng' },
  { id: 'unsafe_sex', label: 'Có quan hệ tình dục không an toàn, nhiều bạn tình, mại dâm...' },
];

export const temporaryDisqualifications = [
  { id: 'flu', label: 'Cúm, cảm sốt, viêm họng, viêm phế quản', deferral: 'trì hoãn 7–14 ngày' },
  { id: 'dengue', label: 'Sốt xuất huyết', deferral: 'hoãn hiến máu ít nhất 6 tháng sau hồi phục' },
  { id: 'malaria', label: 'Sốt rét', deferral: 'tạm hoãn 3 năm sau khi khỏi bệnh (tùy quốc gia)' },
  { id: 'surgery', label: 'Phẫu thuật hoặc tiểu phẫu', deferral: 'hoãn 6 tháng' },
  { id: 'covid', label: 'Nhiễm COVID-19', deferral: 'hoãn 14–28 ngày sau khi khỏi bệnh' },
  { id: 'vaccine', label: 'Tiêm vaccine', deferral: 'tùy loại vắc xin mà hoãn từ 1–4 tuần' },
  { id: 'pregnancy', label: 'Mang thai và sau sinh', deferral: 'đợi 6 tháng sau sinh' },
  { id: 'menstruation', label: 'Kinh nguyệt quá nhiều, mất máu nặng', deferral: 'nên đợi hồi phục sức khỏe' },
  { id: 'antibiotics', label: 'Dùng kháng sinh hoặc điều trị bệnh lý khác', deferral: 'hoãn đến khi khỏi và ngưng thuốc' },
];

export const otherConsiderations = [
  'Người có huyết áp cao không kiểm soát',
  'Thiếu máu',
  'Cân nặng dưới 45kg',
]; 