export const bloodTypes = [
    { id: "1", name: "A+" }, { id: "2", name: "A-" }, { id: "3", name: "B+" },
    { id: "4", name: "B-" }, { id: "5", name: "AB+" }, { id: "6", name: "AB-" },
    { id: "7", name: "O+" }, { id: "8", name: "O-" }, { id: "0", name: "Không biết"}
];

export const getBloodTypeName = (id: string | number | null): string => {
    if (id === null) return 'N/A';
    const stringId = id.toString();
    const bloodType = bloodTypes.find(bt => bt.id === stringId);
    return bloodType ? bloodType.name : 'N/A';
}; 