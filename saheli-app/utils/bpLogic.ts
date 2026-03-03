/**
 * AHA Blood Pressure Categories:
 * Normal: <120 and <80
 * Elevated: 120–129 and <80
 * Stage 1: 130–139 OR 80–89
 * Stage 2: ≥140 OR ≥90
 * Crisis: ≥180 OR ≥120
 */

export type BPCategory = "Normal" | "Elevated" | "Stage 1" | "Stage 2" | "Crisis";
export type AlertStatus = "green" | "orange" | "red";

export interface BPClassification {
    category: BPCategory;
    alertStatus: AlertStatus;
}

export function classifyBP(systolic: number, diastolic: number): BPClassification {
    if (systolic >= 180 || diastolic >= 120) {
        return { category: "Crisis", alertStatus: "red" };
    }
    if (systolic >= 140 || diastolic >= 90) {
        return { category: "Stage 2", alertStatus: "red" };
    }
    if (systolic >= 130 || diastolic >= 80) {
        return { category: "Stage 1", alertStatus: "orange" };
    }
    if (systolic >= 120 && diastolic < 80) {
        return { category: "Elevated", alertStatus: "orange" };
    }
    return { category: "Normal", alertStatus: "green" };
}

export interface BPSummary {
    avgSystolic: number;
    avgDiastolic: number;
    avgPulse: number;
}

export function calculateAverages(readings: any[]): BPSummary {
    if (readings.length === 0) {
        return { avgSystolic: 0, avgDiastolic: 0, avgPulse: 0 };
    }

    const sum = readings.reduce(
        (acc, curr) => ({
            systolic: acc.systolic + curr.systolic,
            diastolic: acc.diastolic + curr.diastolic,
            pulse: acc.pulse + curr.pulse,
        }),
        { systolic: 0, diastolic: 0, pulse: 0 }
    );

    return {
        avgSystolic: Math.round(sum.systolic / readings.length),
        avgDiastolic: Math.round(sum.diastolic / readings.length),
        avgPulse: Math.round(sum.pulse / readings.length),
    };
}

export function groupReadingsByDate(readings: any[]) {
    const groups: Record<string, any[]> = {};
    readings.forEach((r) => {
        const date = r.timestamp.split("T")[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(r);
    });
    return groups;
}
