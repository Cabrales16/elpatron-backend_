# ElPatrón CRM Backend - CURL Examples

# ============================================
# AUTHENTICATION
# ============================================

# 1. LOGIN (Get JWT Token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@elpatron.com",
    "password": "operator123"
  }'

# 2. REGISTER NEW USER
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@elpatron.com",
    "password": "password123",
    "name": "New User"
  }'

# ============================================
# USERS (Admin only)
# ============================================

# 3. GET ALL USERS
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # Replace with actual token
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"

# 4. GET CURRENT USER PROFILE
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer $TOKEN"

# 5. CREATE NEW USER (Admin only)
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newoperator@elpatron.com",
    "password": "securepass123",
    "name": "New Operator",
    "role": "OPERATOR"
  }'

# 6. UPDATE USER (Admin only)
curl -X PATCH http://localhost:3000/users/user-id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "role": "OPERATOR"
  }'

# 7. DELETE USER (Admin only)
curl -X DELETE http://localhost:3000/users/user-id \
  -H "Authorization: Bearer $TOKEN"

# ============================================
# OPERATIONS
# ============================================

# 8. GET ALL OPERATIONS (Operators see only their operations)
curl -X GET http://localhost:3000/operations \
  -H "Authorization: Bearer $TOKEN"

# 9. GET OPERATIONS WITH FILTERS
curl -X GET "http://localhost:3000/operations?status=IN_PROGRESS&assigneeUserId=user-id" \
  -H "Authorization: Bearer $TOKEN"

# 10. CREATE OPERATION
curl -X POST http://localhost:3000/operations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Follow up with customer",
    "description": "Contact customer about new proposal",
    "assigneeUserId": "operator-user-id"
  }'

# 11. GET OPERATION BY ID
curl -X GET http://localhost:3000/operations/operation-id \
  -H "Authorization: Bearer $TOKEN"

# 12. UPDATE OPERATION DETAILS
curl -X PATCH http://localhost:3000/operations/operation-id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "description": "Updated description"
  }'

# 13. CHANGE OPERATION STATUS
curl -X PATCH http://localhost:3000/operations/operation-id/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'

# Status values: NEW, IN_PROGRESS, DONE, BLOCKED

# 14. DELETE OPERATION (Admin only)
curl -X DELETE http://localhost:3000/operations/operation-id \
  -H "Authorization: Bearer $TOKEN"

# ============================================
# WORKSPACES
# ============================================

# 15. GET MY WORKSPACE
curl -X GET http://localhost:3000/workspaces/me \
  -H "Authorization: Bearer $TOKEN"

# 16. GET ALL WORKSPACES (Admin only)
curl -X GET http://localhost:3000/workspaces \
  -H "Authorization: Bearer $TOKEN"

# 17. UPDATE WORKSPACE STATE (Admin only)
curl -X PATCH http://localhost:3000/workspaces/user-id/state \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "state": "ACTIVE",
    "notes": "User workspace is now active"
  }'

# State values: ACTIVE, RESTRICTED, BLOCKED

# ============================================
# AUDIT LOGS
# ============================================

# 18. GET ALL AUDIT LOGS (Admin only)
curl -X GET http://localhost:3000/audit-logs \
  -H "Authorization: Bearer $TOKEN"

# 19. GET MY AUDIT LOGS
curl -X GET http://localhost:3000/audit-logs/me \
  -H "Authorization: Bearer $TOKEN"

# ============================================
# INTEGRATIONS (n8n)
# ============================================

# 20. TEST n8n WEBHOOK (Admin only)
curl -X POST http://localhost:3000/integrations/n8n/test \
  -H "Authorization: Bearer $TOKEN"

# ============================================
# COMPLETE WORKFLOW EXAMPLE
# ============================================

# Step 1: Login
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@elpatron.com",
    "password": "operator123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.id')
echo "Token: $TOKEN"
echo "User ID: $USER_ID"

# Step 2: Create an operation
echo ""
echo "2. Creating operation..."
OPERATION_RESPONSE=$(curl -s -X POST http://localhost:3000/operations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Important client call\",
    \"description\": \"Schedule call with account manager\",
    \"assigneeUserId\": \"$USER_ID\"
  }")

OPERATION_ID=$(echo $OPERATION_RESPONSE | jq -r '.id')
echo "Operation ID: $OPERATION_ID"

# Step 3: Change operation status
echo ""
echo "3. Changing operation status to IN_PROGRESS..."
curl -s -X PATCH http://localhost:3000/operations/$OPERATION_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }' | jq '.'

# Step 4: Check workspace
echo ""
echo "4. Checking workspace..."
curl -s -X GET http://localhost:3000/workspaces/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 5: Check audit logs
echo ""
echo "5. Checking audit logs..."
curl -s -X GET http://localhost:3000/audit-logs/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 6: Test n8n webhook (if admin)
echo ""
echo "6. Testing n8n webhook..."
curl -s -X POST http://localhost:3000/integrations/n8n/test \
  -H "Authorization: Bearer $TOKEN" | jq '.'
