class Collection<K, V> extends Map<K, V> {

    find(fn: (i: V) => boolean): V | undefined {

        for (const [, val] of this) {

            if (fn(val))
                return val;
            else continue;

        }

    }

    filter(fn: (i: V) => boolean): V[] {

        const res: V[] = [];

        for (const [, val] of this) {

            if (fn(val))
                res.push(val);
            else continue;

        }

        return res;

    }

}

export default Collection;