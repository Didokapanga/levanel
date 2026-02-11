// src/components/FormReservationSegment.tsx
import React, { useEffect, useState } from 'react';
import '../styles/FormEntity.css';
import { Button } from './Button';
import type { ReservationSegment } from '../types/reservation_segments';

// services
import { reservationsService } from '../services/reservationsService';
import { airlinesService } from '../services/airlinesService';
import { systemsService } from '../services/systemsService';
import type { Airline } from '../types/airline';

// types minimaux
interface Reservation {
    id: string;
    client_name: string;
}

interface System {
    id: string;
    name: string;
}

interface FormReservationSegmentProps {
    onSubmit: (data: Partial<ReservationSegment>) => void;
    onCancel?: () => void;
    initialData?: Partial<ReservationSegment>;
}

const FormReservationSegment: React.FC<FormReservationSegmentProps> = ({
    onSubmit,
    onCancel,
    initialData,
}) => {
    /** =======================
     *  LISTES
     *  ======================= */
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [systems, setSystems] = useState<System[]>([]);

    /** =======================
     *  FORM STATE
     *  ======================= */
    const [reservationId, setReservationId] = useState(initialData?.reservation_id || '');
    const [airlineId, setAirlineId] = useState(initialData?.airline_id || '');
    const [systemId, setSystemId] = useState(initialData?.system_id || '');

    const [ticketNumber, setTicketNumber] = useState(initialData?.ticket_number || '');
    const [pnr, setPnr] = useState(initialData?.pnr || '');

    const [departure, setDeparture] = useState(initialData?.departure || '');
    const [arrival, setArrival] = useState(initialData?.arrival || '');
    const [origin, setOrigin] = useState(initialData?.origin || '');
    const [destination, setDestination] = useState(initialData?.destination || '');

    const [price, setPrice] = useState<number>(initialData?.price ?? 0);
    const [tax, setTax] = useState<number>(initialData?.tax ?? 0);
    const [serviceFee, setServiceFee] = useState<number>(initialData?.service_fee ?? 0);
    const [commission, setCommission] = useState<number>(initialData?.commission ?? 0);

    const [amountReceived, setAmountReceived] = useState<number>(initialData?.amount_received ?? 0);
    const [cancelPrice, setCancelPrice] = useState<number>(initialData?.cancel_price ?? 0);

    /** =======================
     *  DERIVED
     *  ======================= */
    const totalTTC = price + tax + serviceFee;
    const remainingAmount = totalTTC - amountReceived;

    /** =======================
     *  LOAD DATA
     *  ======================= */
    useEffect(() => {
        reservationsService.list().then((res) => setReservations(res.data));
        airlinesService.list().then(setAirlines);
        systemsService.list().then(setSystems);
    }, []);

    /** =======================
     *  SUBMIT
     *  ======================= */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            reservation_id: reservationId,
            airline_id: airlineId || undefined,
            system_id: systemId || undefined,

            ticket_number: ticketNumber || undefined,
            pnr: pnr || undefined,
            departure: departure || undefined,
            arrival: arrival || undefined,
            origin: origin || undefined,
            destination: destination || undefined,

            price,
            tax,
            service_fee: serviceFee,
            commission,

            amount_received: amountReceived,
            remaining_amount: remainingAmount,

            cancel_price: cancelPrice,
        });
    };

    return (
        <form className="form-entity" onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold">Segment de réservation</h2>

            {/* Réservation */}
            <label>
                Réservation
                <select value={reservationId} onChange={(e) => setReservationId(e.target.value)} required>
                    <option value="">Sélectionner une réservation</option>
                    {reservations.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.client_name} — {r.id.slice(0, 8)}
                        </option>
                    ))}
                </select>
            </label>

            {/* Compagnie */}
            <label>
                Compagnie aérienne
                <select value={airlineId} onChange={(e) => setAirlineId(e.target.value)}>
                    <option value="">Sélectionner une compagnie</option>
                    {airlines.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.code} - {a.name ?? '—'}
                        </option>
                    ))}
                </select>
            </label>

            {/* Système */}
            <label>
                Système de réservation
                <select value={systemId} onChange={(e) => setSystemId(e.target.value)}>
                    <option value="">Sélectionner un système</option>
                    {systems.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </label>

            {/* Vol */}
            <label>
                Numéro de billet
                <input type="text" value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} />
            </label>

            <label>
                PNR
                <input type="text" value={pnr} onChange={(e) => setPnr(e.target.value)} />
            </label>

            <label>
                Origine
                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </label>

            <label>
                Destination
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </label>

            <label>
                Date et heure de départ
                <input type="datetime-local" value={departure} onChange={(e) => setDeparture(e.target.value)} />
            </label>

            <label>
                Date et heure d’arrivée
                <input type="datetime-local" value={arrival} onChange={(e) => setArrival(e.target.value)} />
            </label>

            {/* Financier */}
            <label>
                Prix du billet (HT)
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </label>

            <label>
                Taxes
                <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
            </label>

            <label>
                Frais de service
                <input type="number" value={serviceFee} onChange={(e) => setServiceFee(Number(e.target.value))} />
            </label>

            <label>
                Commission agence
                <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} />
            </label>

            <label>
                Montant reçu
                <input type="number" value={amountReceived} onChange={(e) => setAmountReceived(Number(e.target.value))} />
            </label>

            <label>
                Reste à payer (calculé)
                <input type="number" value={remainingAmount} disabled />
            </label>

            <label>
                Pénalité d’annulation
                <input type="number" value={cancelPrice} onChange={(e) => setCancelPrice(Number(e.target.value))} />
            </label>

            {/* Actions */}
            <div className="form-actions">
                {onCancel && <Button label="Annuler" variant="secondary" onClick={onCancel} />}
                <Button label="Enregistrer" variant="primary" type="submit" />
            </div>
        </form>
    );
};

export default FormReservationSegment;




// // src/components/FormReservationSegment.tsx
// import React, { useEffect, useState } from 'react';
// import '../styles/FormEntity.css';
// import { Button } from './Button';
// import type { ReservationSegment } from '../types/reservation_segments';

// // services
// import { reservationsService } from '../services/reservationsService';
// import { airlinesService } from '../services/airlinesService';
// import { systemsService } from '../services/systemsService';
// import type { Airline } from '../types/airline';

// // types minimaux
// interface Reservation {
//     id: string;
//     client_name: string;
// }

// interface System {
//     id: string;
//     name: string;
// }

// interface FormReservationSegmentProps {
//     onSubmit: (data: Partial<ReservationSegment>) => void;
//     onCancel?: () => void;
//     initialData?: Partial<ReservationSegment>;
// }

// const FormReservationSegment: React.FC<FormReservationSegmentProps> = ({
//     onSubmit,
//     onCancel,
//     initialData,
// }) => {
//     /** =======================
//      *  LISTES
//      *  ======================= */
//     const [reservations, setReservations] = useState<Reservation[]>([]);
//     const [airlines, setAirlines] = useState<Airline[]>([]);
//     const [systems, setSystems] = useState<System[]>([]);

//     /** =======================
//      *  FORM STATE
//      *  ======================= */
//     const [reservationId, setReservationId] = useState(initialData?.reservation_id || '');
//     const [airlineId, setAirlineId] = useState(initialData?.airline_id || '');
//     const [systemId, setSystemId] = useState(initialData?.system_id || '');

//     const [ticketNumber, setTicketNumber] = useState(initialData?.ticket_number || '');
//     const [pnr, setPnr] = useState(initialData?.pnr || '');
//     const [departure, setDeparture] = useState(initialData?.departure || '');
//     const [arrival, setArrival] = useState(initialData?.arrival || '');

//     const [price, setPrice] = useState<number>(initialData?.price ?? 0);
//     const [tax, setTax] = useState<number>(initialData?.tax ?? 0);
//     const [serviceFee, setServiceFee] = useState<number>(initialData?.service_fee ?? 0);
//     const [commission, setCommission] = useState<number>(initialData?.commission ?? 0);

//     const [amountReceived, setAmountReceived] = useState<number>(initialData?.amount_received ?? 0);
//     const [cancelPrice, setCancelPrice] = useState<number>(initialData?.cancel_price ?? 0);

//     /** =======================
//      *  DERIVED
//      *  ======================= */
//     const totalTTC = price + tax + serviceFee;
//     const remainingAmount = totalTTC - amountReceived;

//     /** =======================
//      *  LOAD DATA
//      *  ======================= */
//     useEffect(() => {
//         reservationsService.list().then((res) => {
//             setReservations(res.data);
//         });
//         airlinesService.list().then(setAirlines);
//         systemsService.list().then(setSystems);
//     }, []);

//     /** =======================
//      *  SUBMIT
//      *  ======================= */
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         onSubmit({
//             reservation_id: reservationId,
//             airline_id: airlineId || undefined,
//             system_id: systemId || undefined,

//             ticket_number: ticketNumber || undefined,
//             pnr: pnr || undefined,
//             departure: departure || undefined,
//             arrival: arrival || undefined,

//             price,
//             tax,
//             service_fee: serviceFee,
//             commission,

//             amount_received: amountReceived,
//             remaining_amount: remainingAmount,

//             cancel_price: cancelPrice,
//         });
//     };

//     return (
//         <form className="form-entity" onSubmit={handleSubmit}>
//             <h2 className="text-xl font-semibold">Segment de réservation</h2>

//             {/* ================= RÉSERVATION ================= */}
//             <label>
//                 Réservation
//                 <select
//                     value={reservationId}
//                     onChange={(e) => setReservationId(e.target.value)}
//                     required
//                 >
//                     <option value="">Sélectionner une réservation</option>
//                     {reservations.map((r) => (
//                         <option key={r.id} value={r.id}>
//                             {r.client_name} — {r.id.slice(0, 8)}
//                         </option>
//                     ))}
//                 </select>
//             </label>

//             {/* ================= COMPAGNIE ================= */}
//             <label>
//                 Compagnie aérienne
//                 <select value={airlineId} onChange={(e) => setAirlineId(e.target.value)}>
//                     <option value="">Sélectionner une compagnie</option>
//                     {airlines.map((a) => (
//                         <option key={a.id} value={a.id}>
//                             {a.code} - {a.name ?? '—'}
//                         </option>
//                     ))}
//                 </select>
//             </label>

//             {/* ================= SYSTÈME ================= */}
//             <label>
//                 Système de réservation
//                 <select value={systemId} onChange={(e) => setSystemId(e.target.value)}>
//                     <option value="">Sélectionner un système</option>
//                     {systems.map((s) => (
//                         <option key={s.id} value={s.id}>
//                             {s.name}
//                         </option>
//                     ))}
//                 </select>
//             </label>

//             {/* ================= VOL ================= */}
//             <label>
//                 Numéro de billet
//                 <input
//                     type="text"
//                     value={ticketNumber}
//                     onChange={(e) => setTicketNumber(e.target.value)}
//                 />
//             </label>

//             <label>
//                 PNR
//                 <input
//                     type="text"
//                     value={pnr}
//                     onChange={(e) => setPnr(e.target.value)}
//                 />
//             </label>

//             <label>
//                 Aéroport de départ
//                 <input
//                     type="text"
//                     value={departure}
//                     onChange={(e) => setDeparture(e.target.value)}
//                 />
//             </label>

//             <label>
//                 Aéroport d’arrivée
//                 <input
//                     type="text"
//                     value={arrival}
//                     onChange={(e) => setArrival(e.target.value)}
//                 />
//             </label>

//             {/* ================= FINANCIER ================= */}
//             <label>
//                 Prix du billet (HT / Base fare)
//                 <input
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(Number(e.target.value))}
//                 />
//             </label>

//             <label>
//                 Taxes
//                 <input
//                     type="number"
//                     value={tax}
//                     onChange={(e) => setTax(Number(e.target.value))}
//                 />
//             </label>

//             <label>
//                 Frais de service
//                 <input
//                     type="number"
//                     value={serviceFee}
//                     onChange={(e) => setServiceFee(Number(e.target.value))}
//                 />
//             </label>

//             <label>
//                 Commission agence
//                 <input
//                     type="number"
//                     value={commission}
//                     onChange={(e) => setCommission(Number(e.target.value))}
//                 />
//             </label>

//             <label>
//                 Montant reçu
//                 <input
//                     type="number"
//                     value={amountReceived}
//                     onChange={(e) => setAmountReceived(Number(e.target.value))}
//                 />
//             </label>

//             <label>
//                 Reste à payer (calculé)
//                 <input
//                     type="number"
//                     value={remainingAmount}
//                     disabled
//                 />
//             </label>

//             <label>
//                 Pénalité d’annulation
//                 <input
//                     type="number"
//                     value={cancelPrice}
//                     onChange={(e) => setCancelPrice(Number(e.target.value))}
//                 />
//             </label>

//             {/* ================= ACTIONS ================= */}
//             <div className="form-actions">
//                 {onCancel && (
//                     <Button label="Annuler" variant="secondary" onClick={onCancel} />
//                 )}
//                 <Button label="Enregistrer" variant="primary" type="submit" />
//             </div>
//         </form>
//     );
// };

// export default FormReservationSegment;
