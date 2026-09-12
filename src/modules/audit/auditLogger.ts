import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuditLog, AuditSeverity, AuditCategory } from './types';
import { UserRole } from '../../types';

const AUDIT_STORAGE_KEY = 'hadramout_audit_logs_v1';

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-seed-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actorId: 'user-ahmed-dev',
    actorName: 'م. أحمد أمين بن حرهره',
    actorRole: 'developer',
    action: 'KERNEL_INITIALIZATION',
    category: 'system',
    targetEntity: 'SystemCore',
    targetId: 'kernel-v2.3.7',
    details: 'Applied Zero-Trust Security Kernel and hardened RBAC policies for Hadramout Hyper.',
    severity: 'info',
    ipAddress: '192.168.1.104',
    status: 'SUCCESS'
  },
  {
    id: 'log-seed-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    actorId: 'user-ahmed-dev',
    actorName: 'م. أحمد أمين بن حرهره',
    actorRole: 'developer',
    action: 'FIRESTORE_RULES_ENFORCEMENT',
    category: 'security',
    targetEntity: 'FirestoreSecurityRules',
    targetId: 'rules_v2',
    details: 'Zero-Trust ABAC rule enforcement verified across products, categories, orders, and audit_logs.',
    severity: 'critical',
    ipAddress: '192.168.1.104',
    status: 'SUCCESS'
  },
  {
    id: 'log-seed-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorId: 'user-admin-omar',
    actorName: 'عمر باعباد',
    actorRole: 'admin',
    action: 'BANNER_ACTIVATED',
    category: 'catalog',
    targetEntity: 'BannerConfig',
    targetId: 'banner-ramadan-1',
    details: 'Promotional banner "عروض الجمعة الكبرى" published to mobile home screen.',
    severity: 'info',
    ipAddress: '10.0.0.15',
    status: 'SUCCESS'
  },
  {
    id: 'log-seed-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    actorId: 'user-ops-salem',
    actorName: 'سالم الكندي (العمليات)',
    actorRole: 'operations',
    action: 'ORDER_DISPATCH_OVERRIDE',
    category: 'operations',
    targetEntity: 'Order',
    targetId: 'ORD-9821',
    details: 'Priority order ORD-9821 expedited and assigned to courier Tariq Al-Amoudi.',
    severity: 'warning',
    ipAddress: '10.0.0.22',
    status: 'SUCCESS'
  },
  {
    id: 'log-seed-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actorId: 'user-finance-fahd',
    actorName: 'فهد باوزير (المالية)',
    actorRole: 'finance',
    action: 'PAYMENT_GATEWAY_RECONCILE',
    category: 'finance',
    targetEntity: 'PaymentMethodConfig',
    targetId: 'kuraimi_pay',
    details: 'Daily balance reconciliation for Al Kuraimi Express verified (1,450,000 YER).',
    severity: 'info',
    ipAddress: '10.0.0.31',
    status: 'SUCCESS'
  }
];

class AuditLoggerService {
  private logs: AuditLog[] = [];
  private listeners: Set<(logs: AuditLog[]) => void> = new Set();
  private isFirestoreListening = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.logs = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached audit logs', e);
    }
    this.logs = [...INITIAL_AUDIT_LOGS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.logs.slice(0, 100)));
    } catch (e) {
      console.warn('Failed to save audit logs to localStorage', e);
    }
  }

  private notify() {
    const list = [...this.logs];
    this.listeners.forEach((listener) => listener(list));
  }

  public getLogs(): AuditLog[] {
    return [...this.logs];
  }

  public subscribe(callback: (logs: AuditLog[]) => void): () => void {
    this.listeners.add(callback);
    callback([...this.logs]);

    // Attempt to hook Firestore real-time listener if not already listening
    if (!this.isFirestoreListening) {
      this.isFirestoreListening = true;
      try {
        const auditCol = collection(db, 'audit_logs');
        const q = query(auditCol, orderBy('timestamp', 'desc'), limit(100));
        onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const firestoreLogs: AuditLog[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<AuditLog, 'id'>)
            }));
            // Merge with local logs, deduplicating by id
            const map = new Map<string, AuditLog>();
            firestoreLogs.forEach((l) => map.set(l.id, l));
            this.logs.forEach((l) => {
              if (!map.has(l.id)) map.set(l.id, l);
            });
            this.logs = Array.from(map.values()).sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            this.saveToStorage();
            this.notify();
          }
        }, (err) => {
          // Permitted or offline fallback
          console.log('Firestore audit log listener status:', err.message);
        });
      } catch (err) {
        console.log('Firestore audit listener init:', err);
      }
    }

    return () => {
      this.listeners.delete(callback);
    };
  }

  public async logEvent(params: {
    actorId?: string;
    actorName?: string;
    actorRole?: UserRole;
    action: string;
    category: AuditCategory;
    targetEntity: string;
    targetId?: string;
    details: string | Record<string, any>;
    severity?: AuditSeverity;
    status?: 'SUCCESS' | 'BLOCKED' | 'FAILED';
  }): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actorId: params.actorId || 'system',
      actorName: params.actorName || 'النظام المركزي',
      actorRole: params.actorRole || 'developer',
      action: params.action,
      category: params.category,
      targetEntity: params.targetEntity,
      targetId: params.targetId,
      details: typeof params.details === 'object' ? JSON.stringify(params.details) : params.details,
      severity: params.severity || 'info',
      status: params.status || 'SUCCESS',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      ipAddress: '127.0.0.1'
    };

    // Prepend locally first for immediate UI responsiveness
    this.logs = [newLog, ...this.logs.slice(0, 99)];
    this.saveToStorage();
    this.notify();

    // Persist to Firestore asynchronously
    try {
      const auditCol = collection(db, 'audit_logs');
      await addDoc(auditCol, {
        timestamp: newLog.timestamp,
        actorId: newLog.actorId,
        actorName: newLog.actorName,
        actorRole: newLog.actorRole,
        action: newLog.action,
        category: newLog.category,
        targetEntity: newLog.targetEntity,
        targetId: newLog.targetId || null,
        details: newLog.details,
        severity: newLog.severity,
        status: newLog.status,
        userAgent: newLog.userAgent,
        ipAddress: newLog.ipAddress
      });
    } catch (err) {
      console.warn('Audit log write to Firestore offline or restricted (cached locally):', err);
    }

    return newLog;
  }

  public clearLocalLogs() {
    this.logs = [...INITIAL_AUDIT_LOGS];
    this.saveToStorage();
    this.notify();
  }
}

export const auditLogger = new AuditLoggerService();
