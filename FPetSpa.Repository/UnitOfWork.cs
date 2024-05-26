using FPetSpa.Data;
using FPetSpa.Repository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository
{
    public class UnitOfWork 
    {
        private FpetSpaContext _context;
        private GenericRepository<Service> _service;

        public UnitOfWork(FpetSpaContext context) {
            _context = context;
        }

        public GenericRepository<Service> ServiceRepository
        {
            get
            {
                if(_service == null)
                {
                    this._service = new GenericRepository<Service>(_context);
                }
                return this._service;
            }
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}

