package com.example.websocket.base.service.impl;




import com.example.websocket.base.repository.BaseRepository;
import com.example.websocket.base.service.BaseService;

import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class BaseServiceImpl<E, Repository extends BaseRepository<E>> implements BaseService<E, Repository> {
    protected BaseRepository<E> repository;

    public BaseServiceImpl(Repository repository){
        this.repository = repository;
    }

    @Override
    public E save(E e) {
        return this.repository.save(e);
    }

    @Override
    public Optional<E> findById(Long id) {
        return this.repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        this.repository.deleteById(id);
    }

    @Override
    public Set<E> findAll() {
        return new HashSet<>(this.repository.findAll());
    }

    @Override
    public Set<E> findByIdsIn(Collection<Long> ids) {
        return null;
    }
}
