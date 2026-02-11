import { Routes, Route } from 'react-router-dom';

/* Pages générales */
import Dashboard from '../pages/Dashboard';
import Reservations from '../pages/Reservations';
import ReservationSegments from '../pages/Segments';
import ReservationStatus from '../pages/Status';

/* Finance */
import Cautions from '../pages/Cautions';
import CautionMovements from '../pages/CautionMovements';
import Stocks from '../pages/Stocks';
import StockMovements from '../pages/StockMovement';
import FinancialOperations from '../pages/Operations';

/* Partenaires & contrats */
import Partners from '../pages/Partners';
import Contracts from '../pages/Contracts';

/* Référentiels */
import Systems from '../pages/Systems';
import Airlines from '../pages/Airlines';
import Destinations from '../pages/Destinations';
import PaymentMethods from '../pages/PaymentMethods';

/* Organisation */
import Users from '../pages/Users';
import Roles from '../pages/Roles';
import Departments from '../pages/Departments';

/* Audit & sync */
import AuditLogs from '../pages/AuditLog';
import ChangeLogs from '../pages/ChangeLog';
import Sync from '../pages/Synchronisation';

/* Fallback */
import NotFound from '../pages/NotFound';
import CashRegisters from '../pages/CashRegisters';


export const AppRouter = () => {
    return (
        <Routes>

            {/* Général */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reservation-segments" element={<ReservationSegments />} />
            <Route path="/reservation-status" element={<ReservationStatus />} />

            {/* Finance */}
            <Route path="/cautions" element={<Cautions />} />
            <Route path="/caution-movements" element={<CautionMovements />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stock-movements" element={<StockMovements />} />
            <Route path="/financial-operations" element={<FinancialOperations />} />
            <Route path="/cash_registers" element={<CashRegisters />} />

            {/* Partenaires & contrats */}
            <Route path="/partners" element={<Partners />} />
            <Route path="/contracts" element={<Contracts />} />

            {/* Référentiels */}
            <Route path="/systems" element={<Systems />} />
            <Route path="/airlines" element={<Airlines />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />

            {/* Organisation */}
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/departments" element={<Departments />} />

            {/* Audit & synchronisation */}
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/change-logs" element={<ChangeLogs />} />
            <Route path="/sync" element={<Sync />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
};
