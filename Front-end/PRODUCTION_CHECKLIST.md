# 🚀 CHECKLIST DE DEPLOYMENT - PRODUCCIÓN

Este checklist asegura que el sistema esté listo para producción.

## 📋 Pre-Deployment

### Backend

- [ ] **Variables de Entorno**
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET` generado con >32 caracteres aleatorios
  - [ ] Credenciales Firebase de producción configuradas
  - [ ] `DB_PASSWORD` seguro (no usar root en producción)
  - [ ] `FRONTEND_URL` apunta al dominio real

- [ ] **Base de Datos**
  - [ ] MySQL configurado con usuario dedicado (no root)
  - [ ] Backups automáticos configurados
  - [ ] Índices verificados y optimizados
  - [ ] Límites de conexión apropiados
  - [ ] SSL habilitado para conexiones

- [ ] **Seguridad**
  - [ ] Rate limiting configurado
  - [ ] CORS restringido solo a dominio frontend
  - [ ] Helmet configurado con políticas CSP
  - [ ] Logs no exponen datos sensibles
  - [ ] Firebase service account key guardado en secretos

- [ ] **Performance**
  - [ ] Connection pool optimizado
  - [ ] Queries con índices verificados
  - [ ] Compression habilitado
  - [ ] Cache headers configurados

### Frontend

- [ ] **Build de Producción**
  - [ ] `npm run build` exitoso
  - [ ] Assets optimizados (imágenes comprimidas)
  - [ ] Source maps deshabilitados o en servidor separado
  - [ ] Bundle size analizado (<500KB ideal)

- [ ] **Configuración**
  - [ ] `VITE_API_BASE_URL` apunta a API de producción
  - [ ] Firebase config de producción
  - [ ] Service worker configurado (si aplica)
  - [ ] Error tracking configurado (Sentry, etc)

- [ ] **SEO & Performance**
  - [ ] Meta tags configurados
  - [ ] Favicon agregado
  - [ ] Lighthouse score >90
  - [ ] Lazy loading implementado

## 🔐 Seguridad

- [ ] **Autenticación**
  - [ ] Tokens JWT con expiración apropiada
  - [ ] Refresh token implementado (opcional)
  - [ ] Rate limiting en login
  - [ ] Bloqueo por intentos fallidos

- [ ] **Autorización**
  - [ ] Todos los endpoints verifican autenticación
  - [ ] Roles verificados en backend
  - [ ] Políticas de gobierno activadas
  - [ ] Auto-block configurado según riesgo

- [ ] **Datos**
  - [ ] Passwords nunca en logs
  - [ ] Datos sensibles encriptados en DB
  - [ ] API keys en variables de entorno
  - [ ] SQL injection prevenido (prepared statements)

## 🗄️ Base de Datos

- [ ] **Schema**
  - [ ] Migration ejecutada exitosamente
  - [ ] Todas las tablas creadas
  - [ ] Vistas funcionando
  - [ ] Foreign keys verificadas

- [ ] **Datos Iniciales**
  - [ ] Usuario admin creado en Firebase
  - [ ] Workspace principal creado
  - [ ] Datos de prueba eliminados (si no son necesarios)

- [ ] **Backups**
  - [ ] Backup automático diario configurado
  - [ ] Procedimiento de restore probado
  - [ ] Backups almacenados fuera del servidor

- [ ] **Monitoreo**
  - [ ] Alertas de espacio en disco
  - [ ] Alertas de conexiones máximas
  - [ ] Logs de queries lentas habilitados

## 📊 Monitoreo

- [ ] **Logs**
  - [ ] Backend logs centralizados
  - [ ] Rotación de logs configurada
  - [ ] Nivel de log apropiado (no debug en prod)
  - [ ] Logs estructurados (JSON)

- [ ] **Métricas**
  - [ ] Uptime monitoring (Pingdom, UptimeRobot)
  - [ ] APM configurado (opcional: New Relic, DataDog)
  - [ ] Database monitoring
  - [ ] Error tracking (Sentry)

- [ ] **Alertas**
  - [ ] Alerta si servidor cae
  - [ ] Alerta si DB está lenta
  - [ ] Alerta si disco >80%
  - [ ] Alerta si errores >threshold

## 🚀 Deployment

- [ ] **Servidor**
  - [ ] Firewall configurado (solo puertos necesarios)
  - [ ] SSL/TLS configurado (Let's Encrypt)
  - [ ] Nginx/Apache reverse proxy
  - [ ] PM2 o similar para gestión de procesos
  - [ ] Auto-restart en crash

- [ ] **DNS**
  - [ ] Dominio apuntando a servidor
  - [ ] CDN configurado (CloudFlare, Fastly)
  - [ ] SSL certificate válido

- [ ] **CI/CD**
  - [ ] Pipeline de deployment automatizado
  - [ ] Tests ejecutándose en cada commit
  - [ ] Deploy automático en merge a main

## ✅ Post-Deployment

- [ ] **Verificación**
  - [ ] Health check endpoint responde
  - [ ] Login funciona
  - [ ] Operaciones CRUD funcionan
  - [ ] Decisiones automáticas activas
  - [ ] Auditoría registrando eventos

- [ ] **Testing**
  - [ ] Smoke tests pasando
  - [ ] E2E tests críticos ejecutados
  - [ ] Performance test satisfactorio
  - [ ] Security scan ejecutado

- [ ] **Documentación**
  - [ ] README actualizado con URL producción
  - [ ] API docs publicados
  - [ ] Runbook de incidentes creado
  - [ ] Contactos de emergencia documentados

## 🆘 Rollback Plan

Si algo falla en producción:

1. **Verificar logs** (backend.log, nginx error log)
2. **Revisar métricas** (CPU, RAM, DB connections)
3. **Rollback si es crítico**:
   ```bash
   git revert <commit>
   npm run build
   pm2 restart all
   ```
4. **Restaurar DB si es necesario**:
   ```bash
   mysql -u user -p db_name < backup.sql
   ```
5. **Notificar al equipo**

## 📞 Contactos de Emergencia

```
DBA: _______________
DevOps: _______________
Hosting Provider: _______________
```

## 🎯 Métricas de Éxito

El deployment es exitoso si:

- ✅ Uptime >99.9%
- ✅ Response time <500ms (p95)
- ✅ Error rate <0.1%
- ✅ Auditoría registrando 100% eventos
- ✅ Cero issues de seguridad

---

**Última revisión:** ****\_****
**Revisado por:** ****\_****
**Próxima revisión:** ****\_****
