import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, createUser, updateUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Search, Plus, MoreVertical, Edit2, UserX, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import SlideOver from '../components/ui/SlideOver';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const UserDirectory = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination & Filtering
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // SlideOver State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        page: pageIndex + 1,
        limit: pageSize,
        search: searchTerm,
      });
      if (response.data.success) {
        setData(response.data.data.users);
        setTotalPages(response.data.data.pagination.pages);
        setTotalRecords(response.data.data.pagination.total);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [pageIndex, pageSize, searchTerm]);

  const handleRowClick = (userRow) => {
    setSelectedUser(userRow);
    setIsSlideOverOpen(true);
  };

  const columns = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Avatar name={info.getValue()} className="w-8 h-8 text-xs" />
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (info) => <Badge type={info.getValue()}>{info.getValue()}</Badge>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info) => <Badge type={info.getValue()}>{info.getValue()}</Badge>,
    },
    {
      header: 'Joined',
      accessorKey: 'createdAt',
      cell: (info) => (
        <span className="text-gray-500 font-mono text-sm">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: (info) => {
         const rowUser = info.row.original;
         const canEdit = user.role === 'admin' || (user.role === 'manager' && rowUser.role !== 'admin');
         const canDelete = user.role === 'admin' && rowUser._id !== user._id;

         if (!canEdit && !canDelete) return null;

         return (
          <div className="flex justify-end gap-2 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {canEdit && (
               <button 
                 onClick={(e) => { e.stopPropagation(); handleRowClick(rowUser); }}
                 className="p-1.5 text-gray-400 hover:text-accent rounded hover:bg-accent/10"
               >
                 <Edit2 className="w-4 h-4" />
               </button>
            )}
          </div>
         );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
         const newState = updater({ pageIndex, pageSize });
         setPageIndex(newState.pageIndex);
         setPageSize(newState.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">User Directory</h2>
           <p className="text-sm text-gray-500">Manage your team members and their account permissions.</p>
        </div>
        {user.role === 'admin' && (
          <Button onClick={() => { setSelectedUser(null); setIsSlideOverOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-card border border-surface-border overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-surface-border bg-gray-50/50 flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setPageIndex(0); // reset to page 1 on search
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-surface-border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-surface-border bg-gray-50/80">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={columns.length} className="px-6 py-20 text-center text-gray-500">
                     <Activity className="w-8 h-8 text-accent animate-spin mx-auto mb-2" />
                     Loading users...
                   </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                   <td colSpan={columns.length} className="px-6 py-12">
                     <EmptyState 
                        title="No users found" 
                        description="Try adjusting your search criteria." 
                     />
                   </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => handleRowClick(row.original)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-surface-border bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{data.length ? pageIndex * pageSize + 1 : 0}</span> to <span className="font-medium text-gray-900">{pageIndex * pageSize + data.length}</span> of <span className="font-medium text-gray-900">{totalRecords}</span> results
          </div>
          <div className="flex gap-2">
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => table.previousPage()}
               disabled={!table.getCanPreviousPage() || loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => table.nextPage()}
               disabled={!table.getCanNextPage() || loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <UserDrawer 
         isOpen={isSlideOverOpen} 
         onClose={() => setIsSlideOverOpen(false)} 
         userData={selectedUser}
         onSuccess={() => {
            setIsSlideOverOpen(false);
            fetchData();
         }}
      />
    </div>
  );
};

// Mini-component for the Drawer (to keep file self-contained)
const UserDrawer = ({ isOpen, onClose, userData, onSuccess }) => {
   const { user } = useAuth();
   const isEditing = !!userData;
   const canEdit = isEditing && (user.role === 'admin' || (user.role === 'manager' && userData.role !== 'admin'));
   const canDelete = isEditing && user.role === 'admin' && userData._id !== user._id;
   
   const [formData, setFormData] = useState({
      name: '', email: '', role: 'user', status: 'active', password: ''
   });
   const [saving, setSaving] = useState(false);

   useEffect(() => {
      if (isOpen) {
         if (userData) {
            setFormData({ name: userData.name, email: userData.email, role: userData.role, status: userData.status, password: '' });
         } else {
            setFormData({ name: '', email: '', role: 'user', status: 'active', password: '' });
         }
      }
   }, [isOpen, userData]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
         const payload = { ...formData };
         if (!payload.password) delete payload.password; // Don't send empty password

         if (isEditing) {
            await updateUser(userData._id, payload);
            toast.success('User updated');
         } else {
            const res = await createUser(payload);
            toast.success('User created');
            if (res.data.data.generatedPassword) {
               toast(`Auto-generated password: ${res.data.data.generatedPassword}`, {
                 duration: 6000,
                 icon: '🔑',
               });
            }
         }
         onSuccess();
      } catch (err) {
         toast.error(err.response?.data?.message || 'Error saving user');
      } finally {
         setSaving(false);
      }
   };

   const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to deactivate this user?')) return;
      try {
         await deleteUser(userData._id);
         toast.success('User deactivated');
         onSuccess();
      } catch (err) {
         toast.error('Error deactivating user');
      }
   };

   return (
      <SlideOver isOpen={isOpen} onClose={onClose} title={isEditing ? 'User Details' : 'Add New User'}>
         <div className="flex flex-col h-full bg-surface">
            {/* Top Profile Section */}
            {isEditing && (
               <div className="bg-white p-6 border-b border-gray-100 flex items-center gap-4">
                  <Avatar name={userData.name} className="w-16 h-16 text-2xl" />
                  <div>
                     <h3 className="font-bold text-xl text-gray-900">{userData.name}</h3>
                     <p className="text-gray-500 text-sm mb-2">{userData.email}</p>
                     <div className="flex gap-2">
                        <Badge type={userData.role}>{userData.role}</Badge>
                        <Badge type={userData.status}>{userData.status}</Badge>
                     </div>
                  </div>
               </div>
            )}

            {/* Form Section */}
            <div className="p-6 flex-1 overflow-y-auto">
               <h4 className="font-semibold text-gray-900 mb-4">{isEditing ? 'Edit Information' : 'User Information'}</h4>
               
               <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                     <input required className="w-full p-2 border rounded text-sm focus:ring-accent" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} disabled={isEditing && !canEdit} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                     <input required type="email" className="w-full p-2 border rounded text-sm focus:ring-accent" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} disabled={isEditing && !canEdit} />
                  </div>
                  
                  {(!isEditing || canEdit) && (
                     <>
                        <div className="space-y-1 pt-2">
                           <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                           <select className="w-full p-2 border rounded text-sm bg-white" value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})} disabled={user.role !== 'admin'}>
                              <option value="user">User</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                           </select>
                           {user.role !== 'admin' && <p className="text-xs text-amber-600 mt-1">Only admins can change roles.</p>}
                        </div>
                        <div className="space-y-1 pt-2">
                           <label className="text-xs font-semibold text-gray-500 uppercase">Account Status</label>
                           <select className="w-full p-2 border rounded text-sm bg-white" value={formData.status} onChange={e=>setFormData({...formData, status:e.target.value})}>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                           </select>
                        </div>
                        <div className="space-y-1 pt-2">
                           <label className="text-xs font-semibold text-gray-500 uppercase">{isEditing ? 'New Password (Optional)' : 'Password (Optional)'}</label>
                           <input type="password" placeholder={!isEditing ? "Leave blank to auto-generate" : ""} className="w-full p-2 border rounded text-sm focus:ring-accent" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} minLength={6} />
                        </div>
                     </>
                  )}
               </form>

               {/* Audit Trail */}
               {isEditing && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                     <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Audit Trail</h4>
                     <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent pl-6">
                        <div className="relative font-mono text-xs">
                           <div className="absolute left-[-21px] mt-1 w-2 h-2 rounded bg-accent"></div>
                           <p className="text-gray-500">Created At: <br/><span className="text-gray-800">{new Date(userData.createdAt).toLocaleString()}</span></p>
                           {userData.createdBy && <p className="text-gray-400">By: {userData.createdBy.email}</p>}
                        </div>
                        <div className="relative font-mono text-xs">
                           <div className="absolute left-[-21px] mt-1 w-2 h-2 rounded bg-gray-300"></div>
                           <p className="text-gray-500">Last Updated At: <br/><span className="text-gray-800">{new Date(userData.updatedAt).toLocaleString()}</span></p>
                           {userData.updatedBy && <p className="text-gray-400">By: {userData.updatedBy.email}</p>}
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Footer Actions */}
            {(!isEditing || canEdit || canDelete) && (
               <div className="p-4 border-t bg-gray-50 flex justify-between">
                  {canDelete ? (
                     <Button variant="danger" size="sm" onClick={handleDelete} type="button">Deactivate</Button>
                  ) : <div></div>}
                  {(!isEditing || canEdit) && (
                     <Button form="user-form" type="submit" size="sm" isLoading={saving}>
                        {isEditing ? 'Save Changes' : 'Create User'}
                     </Button>
                  )}
               </div>
            )}
         </div>
      </SlideOver>
   )
}

export default UserDirectory;
