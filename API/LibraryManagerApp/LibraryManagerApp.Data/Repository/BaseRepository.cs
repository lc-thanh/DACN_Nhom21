﻿using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace LibraryManagerApp.Data.Repository
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly LibraryManagerAppDbContext _context;

        public BaseRepository(LibraryManagerAppDbContext context)
        {
            _context = context;
        }

        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _context.Set<T>().Find(id);
            if (entity == null)
                return;

            _context.Set<T>().Remove(entity);
        }

        public IQueryable<T> GetQuery(
            System.Linq.Expressions.Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            string includeProperties = "")
        {
            IQueryable<T> query = _context.Set<T>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty.Trim());
                }
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            return query;
        }

        public IEnumerable<T> GetAll()
        {
            var entities = _context.Set<T>().ToList();
            return entities;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            var entities = await _context.Set<T>().ToListAsync();
            return entities;
        }

        public T? GetById(Guid id)
        {
            var entity = _context.Set<T>().Find(id);
            return entity;
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            return entity;
        }

        public IQueryable<T> GetQuery()
        {
            IQueryable<T> query = _context.Set<T>();
            return query;
        }

        public IQueryable<T> GetQuery(Expression<Func<T, bool>> predicate)
        {
            IQueryable<T> query = _context.Set<T>().Where(predicate);
            return query;
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }
    }
}