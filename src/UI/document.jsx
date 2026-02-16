import { useEffect, useState } from "react";
import { GetVid } from "../FileApiSystem/api";

export function ShowDocument() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...users];
    
    // Search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Image?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sorting
    result.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return (a.userName || '').localeCompare(b.userName || '');
        case 'imageName':
          return (a.Image || '').localeCompare(b.Image || '');
        case 'id':
        default:
          return a.id - b.id;
      }
    });
    
    setFilteredUsers(result);
  }, [users, searchTerm, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await GetVid();
      setUsers(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load images. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleRetry = () => {
    fetchData();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setUsers(prev => prev.filter(user => user.id !== id));
      // In production, you would call a delete API here
    }
  };

  const handleDownload = (user) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${user.dataBase64}`;
    link.download = `${user.Image || 'image'}.png`;
    link.click();
  };

  // Industry-standard CSS-in-JS styles
  const styles = {
    // Main container
    app: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    
    // Header
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem 1rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    
    headerTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      letterSpacing: '-0.025em',
    },
    
    headerSubtitle: {
      fontSize: '1.125rem',
      opacity: '0.9',
      maxWidth: '600px',
      margin: '0 auto 1.5rem',
    },
    
    // Controls
    controls: {
      maxWidth: '1200px',
      margin: '-2rem auto 2rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    searchContainer: {
      flex: '1',
      minWidth: '300px',
      position: 'relative',
    },
    
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 3rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      transition: 'all 0.2s',
      outline: 'none',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      },
    },
    
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    
    filterGroup: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },
    
    select: {
      padding: '0.75rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s',
      '&:focus': {
        borderColor: '#667eea',
      },
    },
    
    viewToggle: {
      display: 'flex',
      gap: '0.5rem',
      backgroundColor: '#f1f5f9',
      padding: '0.25rem',
      borderRadius: '0.75rem',
    },
    
    viewButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: '#64748b',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    
    viewButtonActive: {
      backgroundColor: 'white',
      color: '#334155',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    
    // Stats
    stats: {
      display: 'flex',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    
    statCard: {
      flex: '1',
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },
    
    statTitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      fontWeight: '500',
      marginBottom: '0.5rem',
    },
    
    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
    },
    
    // Content
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem 3rem',
    },
    
    // Loading state
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
    },
    
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #e2e8f0',
      borderTopColor: '#667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    loadingText: {
      marginTop: '1rem',
      color: '#64748b',
      fontSize: '1rem',
    },
    
    // Error state
    errorContainer: {
      textAlign: 'center',
      padding: '3rem 1rem',
    },
    
    errorIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    
    errorTitle: {
      fontSize: '1.5rem',
      color: '#dc2626',
      marginBottom: '0.5rem',
    },
    
    errorMessage: {
      color: '#64748b',
      marginBottom: '1.5rem',
    },
    
    retryButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#2563eb',
      },
    },
    
    // Grid view
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    
    // List view
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    
    // Card styles for both views
    card: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
    },
    
    cardGrid: {
      display: 'flex',
      flexDirection: 'column',
    },
    
    cardList: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#f1f5f9',
    },
    
    imageContainerGrid: {
      height: '200px',
    },
    
    imageContainerList: {
      width: '150px',
      height: '150px',
      flexShrink: '0',
    },
    
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    
    overlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      '&:hover': {
        opacity: '1',
      },
    },
    
    overlayButtons: {
      display: 'flex',
      gap: '0.5rem',
    },
    
    iconButton: {
      backgroundColor: 'white',
      border: 'none',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#f8fafc',
        transform: 'scale(1.1)',
      },
    },
    
    cardContent: {
      padding: '1.25rem',
      flex: '1',
    },
    
    cardContentGrid: {
      padding: '1.25rem',
    },
    
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem',
    },
    
    userName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0',
    },
    
    userId: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      backgroundColor: '#f1f5f9',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
    },
    
    imageName: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginBottom: '0.75rem',
      lineHeight: '1.4',
    },
    
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e2e8f0',
    },
    
    dateBadge: {
      fontSize: '0.75rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    
    deleteButton: {
      color: '#ef4444',
      background: 'none',
      border: 'none',
      fontSize: '0.875rem',
      cursor: 'pointer',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#fee2e2',
      },
    },
    
    // Empty state
    emptyState: {
      textAlign: 'center',
      padding: '4rem 1rem',
    },
    
    emptyIcon: {
      fontSize: '4rem',
      color: '#cbd5e1',
      marginBottom: '1rem',
    },
    
    emptyTitle: {
      fontSize: '1.5rem',
      color: '#475569',
      marginBottom: '0.5rem',
    },
    
    emptyMessage: {
      color: '#94a3b8',
      marginBottom: '1.5rem',
    },
    
    uploadButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#059669',
      },
    },
    
    // Modal
    modalOverlay: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
      padding: '1rem',
    },
    
    modal: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
    },
    
    modalHeader: {
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #e2e8f0',
    },
    
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0',
    },
    
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#94a3b8',
      '&:hover': {
        color: '#64748b',
      },
    },
    
    modalBody: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    
    modalImageContainer: {
      textAlign: 'center',
    },
    
    modalImage: {
      maxWidth: '100%',
      maxHeight: '400px',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    
    modalInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    },
    
    modalInfoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    
    modalInfoLabel: {
      fontSize: '0.875rem',
      color: '#64748b',
      fontWeight: '500',
    },
    
    modalInfoValue: {
      fontSize: '1rem',
      color: '#1e293b',
      fontWeight: '400',
    },
    
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      marginTop: '1rem',
    },
    
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#2563eb',
      },
    },
    
    // Footer
    footer: {
      textAlign: 'center',
      padding: '2rem 1rem',
      color: '#64748b',
      fontSize: '0.875rem',
      borderTop: '1px solid #e2e8f0',
      marginTop: '2rem',
    },
  };

  // Add CSS animations
  const animationStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={styles.app}>
      <style>{animationStyles}</style>
      
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Video Gallery</h1>
        <p style={styles.headerSubtitle}>
          Browse and manage your uploaded images in a beautiful, intuitive interface
        </p>
      </header>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or image..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="imageName">Sort by Document Name</option>
          </select>

          <div style={styles.viewToggle}>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === 'grid' ? styles.viewButtonActive : {})
              }}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === 'list' ? styles.viewButtonActive : {})
              }}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ ...styles.content, ...styles.stats }}>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Total Images</div>
          <div style={styles.statValue}>{users.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Filtered Results</div>
          <div style={styles.statValue}>{filteredUsers.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Storage Used</div>
          <div style={styles.statValue}>
            {(users.length * 2.5).toFixed(1)} MB
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading images...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <h2 style={styles.errorTitle}>Something went wrong</h2>
            <p style={styles.errorMessage}>{error}</p>
            <button style={styles.retryButton} onClick={handleRetry}>
              Retry Loading
            </button>
          </div>
        ) : filteredUsers.length > 0 ? (
          viewMode === 'grid' ? (
            <div style={styles.gridContainer}>
              {filteredUsers.map((user) => (
                <div 
                  key={user.id} 
                  style={{ ...styles.card, ...styles.cardGrid }}
                >
                  <div 
                    style={{ ...styles.imageContainer, ...styles.imageContainerGrid }}
                    onClick={() => handleImageClick(user)}
                  >
                    {user.dataBase64 ? (
                      <>
                        <img
                          style={styles.image}
                          src={`data:image/png;base64,${user.dataBase64}`}
                          alt={user.Image || user.userName}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName || 'User')}&background=667eea&color=fff&size=200`;
                          }}
                        />
                        <div style={styles.overlay}>
                          <div style={styles.overlayButtons}>
                            <button 
                              style={styles.iconButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(user);
                              }}
                              title="Download"
                            >
                              ⬇️
                            </button>
                            <button 
                              style={styles.iconButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageClick(user);
                              }}
                              title="View"
                            >
                              👁️
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                      }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div style={styles.cardContentGrid}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.userName}>{user.userName || 'Anonymous'}</h3>
                      <span style={styles.userId}>ID: {user.id}</span>
                    </div>
                    <p style={styles.imageName}>
                      {user.Image || 'Untitled Image'}
                    </p>
                    <div style={styles.cardFooter}>
                      <span style={styles.dateBadge}>
                        📅 Uploaded recently
                      </span>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.listContainer}>
              {filteredUsers.map((user) => (
                <div 
                  key={user.id} 
                  style={{ ...styles.card, ...styles.cardList }}
                >
                  <div 
                    style={{ ...styles.imageContainer, ...styles.imageContainerList }}
                    onClick={() => handleImageClick(user)}
                  >
                    {user.dataBase64 ? (
                      <>
                        <img
                          style={styles.image}
                          src={`data:image/png;base64,${user.dataBase64}`}
                          alt={user.Image || user.userName}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName || 'User')}&background=667eea&color=fff&size=200`;
                          }}
                        />
                        <div style={styles.overlay}>
                          <div style={styles.overlayButtons}>
                            <button 
                              style={styles.iconButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(user);
                              }}
                              title="Download"
                            >
                              ⬇️
                            </button>
                            <button 
                              style={styles.iconButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageClick(user);
                              }}
                              title="View"
                            >
                              👁️
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                      }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div style={styles.cardContent}>
                    <div style={styles.cardHeader}>
                      <div>
                        <h3 style={styles.userName}>{user.userName || 'Anonymous'}</h3>
                        <p style={styles.imageName}>
                          {user.Image || 'Untitled Image'}
                        </p>
                      </div>
                      <span style={styles.userId}>ID: {user.id}</span>
                    </div>
                    <div style={styles.cardFooter}>
                      <span style={styles.dateBadge}>
                        📅 Uploaded recently
                      </span>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button 
                          style={{ ...styles.primaryButton, fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                          onClick={() => handleDownload(user)}
                        >
                          Download
                        </button>
                        <button 
                          style={styles.deleteButton}
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🖼️</div>
            <h2 style={styles.emptyTitle}>No images found</h2>
            <p style={styles.emptyMessage}>
              {searchTerm ? 'Try adjusting your search or filters' : 'Upload your first image to get started'}
            </p>
            {!searchTerm && (
              <button style={styles.uploadButton}>
                Upload Image
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Image Gallery • {new Date().getFullYear()} • Showing {filteredUsers.length} of {users.length} images</p>
      </footer>

      {/* Modal for image preview */}
      {selectedUser && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedUser.userName || 'Image Preview'}</h2>
              <button style={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalImageContainer}>
                {selectedUser.dataBase64 ? (
                  <img
                    style={styles.modalImage}
                    src={`data:image/png;base64,${selectedUser.dataBase64}`}
                    alt={selectedUser.Image || selectedUser.userName}
                  />
                ) : (
                  <div style={{
                    padding: '3rem',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '0.5rem',
                    color: '#94a3b8',
                  }}>
                    No image available
                  </div>
                )}
              </div>
              <div style={styles.modalInfo}>
                <div style={styles.modalInfoItem}>
                  <span style={styles.modalInfoLabel}>User ID</span>
                  <span style={styles.modalInfoValue}>{selectedUser.id}</span>
                </div>
                <div style={styles.modalInfoItem}>
                  <span style={styles.modalInfoLabel}>Username</span>
                  <span style={styles.modalInfoValue}>{selectedUser.userName || 'Anonymous'}</span>
                </div>
                <div style={styles.modalInfoItem}>
                  <span style={styles.modalInfoLabel}>Document Name</span>
                  <span style={styles.modalInfoValue}>{selectedUser.Image || 'Untitled'}</span>
                </div>
                <div style={styles.modalInfoItem}>
                  <span style={styles.modalInfoLabel}>Image Size</span>
                  <span style={styles.modalInfoValue}>
                    {selectedUser.dataBase64 
                      ? `${Math.round(selectedUser.dataBase64.length * 0.75 / 1024)} KB` 
                      : 'Unknown'}
                  </span>
                </div>
              </div>
              <div style={styles.modalActions}>
                <button style={styles.primaryButton} onClick={() => handleDownload(selectedUser)}>
                  Download Image
                </button>
                <button 
                  style={{ ...styles.deleteButton, padding: '0.75rem 1.5rem' }}
                  onClick={() => {
                    handleDelete(selectedUser.id);
                    handleCloseModal();
                  }}
                >
                  Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}